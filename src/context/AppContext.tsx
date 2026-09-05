import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Role,
  School,
  Program,
  Course,
  Module,
  Lesson,
  Assignment,
  AssignmentSubmission,
  Examination,
  ExamAttempt,
  GradeRecord,
  Certificate,
  LibraryResource,
  Application,
  RPLApplication,
  Announcement,
  FinancialTransaction,
  SupportTicket,
  Question,
  Invoice,
  UniversityInfo,
  Bulletin,
  BulletinCategory
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_SCHOOLS,
  INITIAL_PROGRAMS,
  INITIAL_COURSES,
  INITIAL_MODULES,
  INITIAL_ASSIGNMENTS,
  INITIAL_EXAMINATIONS,
  INITIAL_GRADES,
  INITIAL_CERTIFICATES,
  INITIAL_LIBRARY_RESOURCES,
  INITIAL_APPLICATIONS,
  INITIAL_RPL_APPLICATIONS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_FINANCIALS,
  INITIAL_INVOICES,
  INITIAL_SUPPORT_TICKETS,
  UNIVERSITY_INFO
} from '../data/mockData';
import {
  INITIAL_BULLETINS,
  INITIAL_BULLETIN_CATEGORIES,
  INITIAL_BULLETIN_DEPARTMENTS
} from '../data/bulletinsData';
import { Alumni } from '../types/alumni';
import { INITIAL_ALUMNI_DATABASE } from '../data/alumniData';
import {
  RPLApplicationRecord,
  RPLProgramRule,
  RPLCompetencyItem,
  RPLAssessmentMethod,
  RPLStatus
} from '../types/rpl';
import {
  INITIAL_RPL_APPLICATIONS as DETAILED_RPL_APPLICATIONS,
  INITIAL_RPL_PROGRAM_RULES
} from '../data/rplData';
import {
  KenyaCounty,
  GlobalCountry,
  ExaminationCentre,
  CentreStudent,
  NationalRepresentative,
  ExaminationSession,
  CentreExamAttendanceRecord,
  CentreExamRegistration,
  AuditLogEntry,
  AttendanceStatus,
  ApplicationWorkflowStatus,
  StudentTransferAudit,
  CentreStudentDocument
} from '../types/examCentres';
import {
  KENYA_47_COUNTIES,
  GLOBAL_COUNTRIES,
  INITIAL_EXAMINATION_CENTRES,
  INITIAL_CENTRE_STUDENTS,
  INITIAL_EXAMINATION_SESSIONS,
  INITIAL_EXAM_ATTENDANCES,
  INITIAL_AUDIT_LOGS
} from '../data/examCentresData';
import {
  MediaCategory,
  MediaChannel,
  MediaVideo,
  MediaPlaylist,
  TVProgram,
  RadioProgram,
  RadioSettings,
  YouTubeSettings,
  MediaPresenter,
  StudentMediaProgress,
  MediaAnalyticsData
} from '../types/media';
import {
  INITIAL_MEDIA_CHANNELS,
  INITIAL_YOUTUBE_SETTINGS,
  FEATURED_BIBU_TV_VIDEO,
  INITIAL_RADIO_SETTINGS,
  INITIAL_RADIO_SCHEDULE,
  INITIAL_TV_PROGRAMS,
  INITIAL_MEDIA_VIDEOS,
  INITIAL_MEDIA_PLAYLISTS,
  INITIAL_MEDIA_PRESENTERS,
  INITIAL_STUDENT_MEDIA_PROGRESS,
  INITIAL_MEDIA_ANALYTICS
} from '../data/mediaData';
import {
  GraduationCeremony,
  GraduationCandidate,
  GraduationBooklet,
  AcademicAwardWinner,
  GraduationCertificateRecord,
  GraduationAuditLog,
  DepartmentClearanceRecord,
  DepartmentClearanceStatus
} from '../types/graduation';
import {
  INITIAL_GRADUATION_CEREMONIES,
  INITIAL_GRADUATION_CANDIDATES,
  INITIAL_GRADUATION_BOOKLET,
  INITIAL_ACADEMIC_AWARDS,
  INITIAL_GRADUATION_CERTIFICATES,
  INITIAL_AUDIT_LOGS as INITIAL_GRADUATION_AUDIT_LOGS
} from '../data/graduationMockData';

export type CurrentView = 
  | 'home'
  | 'about'
  | 'schools'
  | 'programs'
  | 'program-detail'
  | 'admissions'
  | 'rpl'
  | 'rpl-slides'
  | 'library'
  | 'verification'
  | 'contact'
  | 'news'
  | 'bulletins'
  | 'bulletin-detail'
  | 'portals'
  | 'portal-access'
  | 'student-dashboard'
  | 'classroom'
  | 'exam-taker'
  | 'transcript'
  | 'finance'
  | 'faculty-portal'
  | 'admin-portal'
  | 'support'
  | 'alumni'
  | 'fellowships'
  | 'login'
  | 'register'
  | 'create-account'
  | 'account'
  | 'my-account'
  | 'exam-centres'
  | 'kenya-counties'
  | 'national-rep-portal'
  | 'centre-rep-portal'
  | 'exam-attendance'
  | 'centre-directory'
  | 'centre-reports'
  // BIBU TV & Radio Media Center Subsections
  | 'breakthrough-tv'
  | 'media-center'
  | 'bibu-tv'
  | 'bibu-radio'
  | 'live-tv'
  | 'live-radio'
  | 'media-programs'
  | 'media-sermons'
  | 'media-news'
  | 'media-podcasts'
  | 'media-archives'
  | 'youtube-channel'
  | 'faculty-media'
  // Graduation Management, Booklet & Alumni Subsections
  | 'graduation'
  | 'graduates'
  | 'graduation-booklet'
  | 'alumni-directory'
  | 'alumni-events'
  | 'alumni-news'
  | 'graduation-reports';

export interface RegisterUserData {
  name: string;
  email: string;
  password?: string;
  role: Role;
  country: string;
  ministryAffiliation?: string;
  programName?: string;
  title?: string;
  studentId?: string;
  facultyId?: string;
}

interface AppContextType {
  // Navigation & User
  currentView: CurrentView;
  setCurrentView: (view: CurrentView) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: Role) => void;
  allUsers: User[];
  
  // Authentication & Registration
  authModalOpen: boolean;
  authModalTab: 'login' | 'register';
  authTargetPortal: CurrentView | null;
  setAuthTargetPortal: (portal: CurrentView | null) => void;
  authMessage: string | null;
  setAuthMessage: (msg: string | null) => void;
  openAuthModal: (tab?: 'login' | 'register', targetPortal?: CurrentView, message?: string) => void;
  closeAuthModal: () => void;
  registerUser: (data: RegisterUserData) => { success: boolean; error?: string };
  loginUser: (email: string, password?: string) => { success: boolean; error?: string };
  logoutUser: () => void;
  requireAuth: (allowedRoles?: Role[], targetView?: CurrentView, message?: string) => boolean;

  // Selection States
  selectedSchoolId: string | null;
  setSelectedSchoolId: (id: string | null) => void;
  selectedProgramId: string | null;
  setSelectedProgramId: (id: string | null) => void;
  selectedCourseId: string;
  setSelectedCourseId: (id: string) => void;
  selectedLessonId: string;
  setSelectedLessonId: (id: string) => void;
  selectedExamId: string | null;
  setSelectedExamId: (id: string | null) => void;
  selectedBulletinId: string | null;
  setSelectedBulletinId: (id: string | null) => void;

  // University Live Site Data & CMS State
  universityInfo: UniversityInfo;
  updateUniversityInfo: (updates: Partial<UniversityInfo>) => void;
  schools: School[];
  programs: Program[];
  courses: Course[];
  modules: Module[];
  assignments: Assignment[];
  assignmentSubmissions: AssignmentSubmission[];
  examinations: Examination[];
  examAttempts: ExamAttempt[];
  grades: GradeRecord[];
  certificates: Certificate[];
  libraryResources: LibraryResource[];
  applications: Application[];
  rplApplications: RPLApplication[];
  rplRecords: RPLApplicationRecord[];
  rplProgramRules: RPLProgramRule[];
  announcements: Announcement[];
  bulletins: Bulletin[];
  bulletinCategories: BulletinCategory[];
  bulletinDepartments: string[];
  financials: FinancialTransaction[];
  invoices: Invoice[];
  supportTickets: SupportTicket[];

  // Completed Lessons Tracking
  completedLessonIds: string[];
  markLessonComplete: (lessonId: string) => void;

  // Workflow Actions
  submitApplication: (appData: Omit<Application, 'id' | 'applicationNumber' | 'status' | 'submittedDate'>) => Application;
  updateApplicationStatus: (appId: string, status: Application['status'], adminNotes?: string) => void;
  deleteApplication: (appId: string) => void;
  submitRPLApplication: (rplData: Omit<RPLApplication, 'id' | 'applicationNumber' | 'status' | 'dateSubmitted'>) => RPLApplication;
  updateRPLStatus: (rplId: string, status: RPLApplication['status'], approvedCredits?: number, notes?: string) => void;
  deleteRPLApplication: (rplId: string) => void;

  // Detailed Institutional RPL Methods
  submitDetailedRPLApplication: (record: Omit<RPLApplicationRecord, 'id' | 'applicationNumber' | 'verificationCode' | 'submissionDate' | 'status' | 'progressPercentage' | 'approvedCredits' | 'transcriptEntryConfirmed' | 'appeals' | 'auditLogs'>) => RPLApplicationRecord;
  updateRPLRecord: (id: string, updates: Partial<RPLApplicationRecord>) => void;
  deleteRPLRecord: (id: string) => void;
  assessRPLCompetency: (rplId: string, compId: string, decision: RPLCompetencyItem['assessorDecision'], awardedCredits: number, notes?: string) => void;
  scheduleRPLInterview: (rplId: string, interviewDate: string, notes?: string) => void;
  finalizeRPLAssessment: (rplId: string, status: RPLStatus, approvedCredits: number, notes: string, methods: RPLAssessmentMethod[]) => void;
  submitRPLAppeal: (rplId: string, appeal: { groundsForAppeal: string; applicantStatement: string; supportingEvidenceNotes: string }) => void;
  syncRPLToTranscript: (rplId: string) => { success: boolean; message: string; creditsConferred: number };
  verifyRPLCode: (code: string) => RPLApplicationRecord | undefined;
  updateRPLProgramRules: (rules: RPLProgramRule[]) => void;
  
  submitAssignment: (assignmentId: string, content: string, fileName?: string) => void;
  gradeAssignment: (submissionId: string, grade: number, feedback: string) => void;

  submitExamAttempt: (examId: string, answers: { [qId: string]: string | number }, score: number, percentage: number, grade: string) => void;
  moderateExamAttempt: (attemptId: string, comments: string, adjustedScore?: number) => void;

  payInvoice: (invoiceId: string, method?: string) => void;
  createInvoice: (inv: Omit<Invoice, 'id' | 'invoiceNumber'>) => Invoice;
  updateInvoiceStatus: (id: string, status: Invoice['status']) => void;
  deleteInvoice: (id: string) => void;

  createSupportTicket: (category: SupportTicket['category'], subject: string, message: string, priority: SupportTicket['priority']) => void;
  replySupportTicket: (ticketId: string, message: string) => void;

  // Super Admin Full-Site CMS CRUD
  addSchool: (school: Omit<School, 'id'>) => School;
  updateSchool: (id: string, updates: Partial<School>) => void;
  deleteSchool: (id: string) => void;

  addProgram: (program: Omit<Program, 'id'>) => Program;
  updateProgram: (id: string, updates: Partial<Program>) => void;
  deleteProgram: (id: string) => void;

  addCourse: (course: Omit<Course, 'id'>) => Course;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;

  addModule: (courseId: string, title: string, description: string) => Module;
  updateModule: (id: string, updates: Partial<Module>) => void;
  deleteModule: (id: string) => void;

  addLesson: (moduleId: string, lesson: Omit<Lesson, 'id'>) => Lesson;
  updateLesson: (moduleId: string, lessonId: string, updates: Partial<Lesson>) => void;
  deleteLesson: (moduleId: string, lessonId: string) => void;

  addQuestionToBank: (question: Omit<Question, 'id'>) => void;
  createExam: (exam: Omit<Examination, 'id'>) => Examination;
  updateExam: (id: string, updates: Partial<Examination>) => void;
  deleteExam: (id: string) => void;
  addQuestionToExam: (examId: string, question: Omit<Question, 'id'>) => void;
  updateQuestionInExam: (examId: string, questionId: string, updates: Partial<Question>) => void;
  deleteQuestionFromExam: (examId: string, questionId: string) => void;

  createCertificate: (cert: Omit<Certificate, 'id' | 'verificationCode'>) => Certificate;
  issueCertificate: (certData: {
    studentName: string;
    studentId: string;
    degreeTitle: string;
    schoolName: string;
    honors?: string;
    chancellorName?: string;
    registrarName?: string;
  }) => Certificate;
  updateCertificate: (id: string, updates: Partial<Certificate>) => void;
  revokeCertificate: (id: string) => void;
  reinstateCertificate: (id: string) => void;
  deleteCertificate: (id: string) => void;

  addLibraryResource: (resource: Omit<LibraryResource, 'id'>) => LibraryResource;
  updateLibraryResource: (id: string, updates: Partial<LibraryResource>) => void;
  deleteLibraryResource: (id: string) => void;

  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => Announcement;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;

  // Bulletins & Official Announcements System
  createBulletin: (data: Partial<Bulletin>) => Bulletin;
  updateBulletin: (id: string, updates: Partial<Bulletin>) => void;
  approveBulletin: (id: string, approverName?: string) => void;
  publishBulletin: (id: string, publisherName?: string) => void;
  unpublishBulletin: (id: string, userName?: string) => void;
  archiveBulletin: (id: string, userName?: string) => void;
  duplicateBulletin: (id: string, userName?: string) => Bulletin;
  deleteBulletin: (id: string, userName?: string) => void;
  recordBulletinView: (id: string) => void;
  recordBulletinDownload: (id: string) => void;
  verifyBulletinCode: (code: string) => Bulletin | undefined;
  addBulletinCategory: (category: string) => void;
  addBulletinDepartment: (department: string) => void;

  // Enrolment & Student Course Access Control
  enrollStudentInCourse: (studentId: string, courseId: string) => void;
  unenrollStudentFromCourse: (studentId: string, courseId: string) => void;
  isStudentEnrolledInCourse: (courseId: string, user?: User) => boolean;
  getStudentEnrolledCourses: (user?: User) => Course[];
  assignStudentProgram: (studentId: string, programId: string) => void;
  requestCourseEnrolment: (courseId: string, reason?: string, term?: string, studyMode?: string) => { success: boolean; message: string; ticketNumber: string };
  requestModuleEnrolment: (courseId: string, moduleId: string, reason?: string, term?: string) => { success: boolean; message: string; ticketNumber: string };

  createUser: (user: Omit<User, 'id'>) => User;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  updateUserRole: (id: string, role: Role) => void;

  // Global Alumni Management System (2017-2026, 50+ Nations)
  alumniList: Alumni[];
  addAlumni: (alumni: Omit<Alumni, 'id' | 'created_at' | 'updated_at'>) => Alumni;
  updateAlumni: (id: string, updates: Partial<Alumni>) => void;
  deleteAlumni: (id: string) => void;
  importAlumniRecords: (records: Partial<Alumni>[]) => { successCount: number; errors: string[] };
  verifyAlumniGraduate: (query: { alumniId?: string; certificateNumber?: string; studentId?: string }) => Alumni | undefined;
  graduateStudentToAlumni: (studentId: string, graduationData?: Partial<Alumni>) => Alumni;

  // Global Examination Centre & 47-County Student Registration System
  kenyaCounties: KenyaCounty[];
  globalCountries: GlobalCountry[];
  examinationCentres: ExaminationCentre[];
  centreStudents: CentreStudent[];
  examSessions: ExaminationSession[];
  examAttendanceRecords: CentreExamAttendanceRecord[];
  auditLogs: AuditLogEntry[];
  selectedCentreId: string | null;
  setSelectedCentreId: (id: string | null) => void;
  selectedCountyCode: number | null;
  setSelectedCountyCode: (code: number | null) => void;
  selectedCountryCode: string | null;
  setSelectedCountryCode: (code: string | null) => void;

  addExaminationCentre: (centreData: Omit<ExaminationCentre, 'id' | 'centreCode' | 'enrolledStudentsCount' | 'registeredCandidatesCount' | 'availableSeats'>) => ExaminationCentre;
  updateExaminationCentre: (id: string, updates: Partial<ExaminationCentre>) => void;
  deleteExaminationCentre: (id: string) => void;
  registerStudentWithCentre: (studentData: Partial<CentreStudent>) => { student: CentreStudent; studentNumber: string };
  updateCentreStudent: (id: string, updates: Partial<CentreStudent>) => void;
  deleteCentreStudent: (id: string) => void;
  transferStudentCentre: (studentId: string, toCentreId: string, reason: string, adminName?: string) => { success: boolean; message: string };
  checkDuplicateStudent: (data: { nationalIdOrPassport?: string; email?: string; phone?: string; studentNumber?: string; excludeId?: string }) => CentreStudent | undefined;
  verifyStudentDocument: (studentId: string, documentId: string, status: 'Verified' | 'Rejected', verifiedBy: string, remarks?: string) => void;
  recordExamAttendance: (record: Partial<CentreExamAttendanceRecord>) => void;
  updateAttendanceStatus: (attendanceId: string, status: AttendanceStatus, remarks?: string, timeOut?: string) => void;
  addKenyaCounty: (county: Omit<KenyaCounty, 'id'>) => KenyaCounty;
  updateKenyaCounty: (id: string, updates: Partial<KenyaCounty>) => void;
  addGlobalCountry: (country: Omit<GlobalCountry, 'id'>) => GlobalCountry;
  updateGlobalCountry: (id: string, updates: Partial<GlobalCountry>) => void;
  logAuditEvent: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
  generateStudentNumber: (countryCode: string, cityOrCounty: string) => string;
  generateCentreCode: (countryCode: string, cityOrCounty: string) => string;

  resetToDefaultData: () => void;

  // Search & Global Helpers
  verifyCertificateCode: (code: string) => Certificate | undefined;
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;

  // BIBU TV & Radio Media Center System
  mediaChannels: MediaChannel[];
  mediaVideos: MediaVideo[];
  mediaPlaylists: MediaPlaylist[];
  tvPrograms: TVProgram[];
  radioPrograms: RadioProgram[];
  radioSettings: RadioSettings;
  youtubeSettings: YouTubeSettings;
  mediaPresenters: MediaPresenter[];
  studentMediaProgress: StudentMediaProgress[];
  mediaAnalytics: MediaAnalyticsData;
  activePlayingVideo: MediaVideo | null;
  setActivePlayingVideo: (video: MediaVideo | null) => void;
  isRadioPlaying: boolean;
  setIsRadioPlaying: (playing: boolean) => void;
  radioVolume: number;
  setRadioVolume: (volume: number) => void;
  isRadioMuted: boolean;
  setIsRadioMuted: (muted: boolean) => void;
  toggleRadioPlay: () => void;
  selectedMediaCategory: MediaCategory | 'All';
  setSelectedMediaCategory: (cat: MediaCategory | 'All') => void;
  
  // Media CRUD & Operations
  addMediaVideo: (video: Omit<MediaVideo, 'id' | 'viewsCount' | 'likesCount'>) => MediaVideo;
  updateMediaVideo: (id: string, updates: Partial<MediaVideo>) => void;
  deleteMediaVideo: (id: string) => void;
  reorderMediaVideos: (sourceId: string, direction: 'up' | 'down') => void;
  addTVProgram: (program: Omit<TVProgram, 'id'>) => TVProgram;
  updateTVProgram: (id: string, updates: Partial<TVProgram>) => void;
  deleteTVProgram: (id: string) => void;
  addRadioProgram: (program: Omit<RadioProgram, 'id'>) => RadioProgram;
  updateRadioProgram: (id: string, updates: Partial<RadioProgram>) => void;
  deleteRadioProgram: (id: string) => void;
  updateRadioSettings: (settings: Partial<RadioSettings>) => void;
  updateYouTubeSettings: (settings: Partial<YouTubeSettings>) => void;
  addMediaPresenter: (presenter: Omit<MediaPresenter, 'id'>) => MediaPresenter;
  updateMediaPresenter: (id: string, updates: Partial<MediaPresenter>) => void;
  deleteMediaPresenter: (id: string) => void;
  toggleStudentBookmarkVideo: (videoId: string) => void;
  toggleStudentFavoriteVideo: (videoId: string) => void;
  updateStudentVideoProgress: (videoId: string, watchedSeconds: number, totalSeconds: number) => void;
  recordVideoView: (videoId: string) => void;

  // Graduation Management, Candidates, Booklets, Certificates & Awards
  graduationCeremonies: GraduationCeremony[];
  addGraduationCeremony: (ceremony: Omit<GraduationCeremony, 'id' | 'createdAt' | 'updatedAt'>) => GraduationCeremony;
  updateGraduationCeremony: (id: string, updates: Partial<GraduationCeremony>) => void;
  deleteGraduationCeremony: (id: string) => void;

  graduationCandidates: GraduationCandidate[];
  addGraduationCandidate: (candidate: Omit<GraduationCandidate, 'id' | 'createdAt' | 'updatedAt'>) => GraduationCandidate;
  updateGraduationCandidate: (id: string, updates: Partial<GraduationCandidate>) => void;
  deleteGraduationCandidate: (id: string) => void;
  updateDepartmentClearance: (candidateId: string, department: keyof GraduationCandidate['clearances'], record: Partial<DepartmentClearanceRecord>) => void;
  conferCandidateToGraduate: (candidateId: string) => { candidate: GraduationCandidate; certificate: GraduationCertificateRecord; alumni?: Alumni };

  graduationBooklets: GraduationBooklet[];
  activeGraduationBooklet: GraduationBooklet | null;
  setActiveGraduationBooklet: (booklet: GraduationBooklet | null) => void;
  generateGraduationBooklet: (ceremonyId: string, overrides?: Partial<GraduationBooklet>) => GraduationBooklet;
  updateGraduationBooklet: (bookletId: string, updates: Partial<GraduationBooklet>) => void;

  academicAwards: AcademicAwardWinner[];
  addAcademicAward: (award: Omit<AcademicAwardWinner, 'id'>) => AcademicAwardWinner;
  updateAcademicAward: (id: string, updates: Partial<AcademicAwardWinner>) => void;
  deleteAcademicAward: (id: string) => void;

  graduationCertificates: GraduationCertificateRecord[];
  issueGraduationCertificateRecord: (candidateId: string) => GraduationCertificateRecord;
  updateGraduationCertificateRecord: (id: string, updates: Partial<GraduationCertificateRecord>) => void;

  graduationAuditLogs: GraduationAuditLog[];
  logGraduationAudit: (entry: Omit<GraduationAuditLog, 'id' | 'timestamp'>) => void;

  bulkImportCandidates: (candidates: Partial<GraduationCandidate>[]) => { successCount: number; errors: string[] };
  verifyGraduationCredential: (query: { certificateNumber?: string; studentId?: string; candidateId?: string }) => {
    found: boolean;
    candidate?: GraduationCandidate;
    certificate?: GraduationCertificateRecord;
    alumni?: Alumni;
    message: string;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & User
  const [currentView, setCurrentView] = useState<CurrentView>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/breakthrough-tv' || window.location.hash === '#breakthrough-tv') {
        return 'breakthrough-tv';
      }
    }
    return 'home';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (currentView === 'breakthrough-tv') {
        if (window.location.pathname !== '/breakthrough-tv') {
          window.history.pushState(null, '', '/breakthrough-tv');
        }
      } else if (window.location.pathname === '/breakthrough-tv') {
        window.history.pushState(null, '', '/');
      }
    }
  }, [currentView]);

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === '/breakthrough-tv') {
        setCurrentView('breakthrough-tv');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('bibu_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('bibu_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    // Default starting state: Pastor David (Active Student) or Guest
    return INITIAL_USERS[0];
  });

  // Authentication Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('register');
  const [authTargetPortal, setAuthTargetPortal] = useState<CurrentView | null>(null);
  const [authMessage, setAuthMessage] = useState<string | null>(null);

  // Selections
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('crs-herm-301');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('les-herm-101');
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [selectedBulletinId, setSelectedBulletinId] = useState<string | null>(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // University Info & CMS Settings
  const [universityInfo, setUniversityInfo] = useState<UniversityInfo>(() => {
    const saved = localStorage.getItem('bibu_university_info');
    return saved ? JSON.parse(saved) : UNIVERSITY_INFO;
  });

  // Collections with LocalStorage hydration
  const [schools, setSchools] = useState<School[]>(() => {
    const saved = localStorage.getItem('bibu_schools');
    return saved ? JSON.parse(saved) : INITIAL_SCHOOLS;
  });

  const [programs, setPrograms] = useState<Program[]>(() => {
    const saved = localStorage.getItem('bibu_programs');
    return saved ? JSON.parse(saved) : INITIAL_PROGRAMS;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('bibu_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [modules, setModules] = useState<Module[]>(() => {
    const saved = localStorage.getItem('bibu_modules');
    return saved ? JSON.parse(saved) : INITIAL_MODULES;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('bibu_assignments');
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [assignmentSubmissions, setAssignmentSubmissions] = useState<AssignmentSubmission[]>(() => {
    const saved = localStorage.getItem('bibu_submissions');
    return saved ? JSON.parse(saved) : [
      {
        id: 'sub-001',
        assignmentId: 'asg-herm-1',
        studentId: 'usr-student-1',
        studentName: 'David Emmanuel',
        submittedAt: '2026-08-16 14:30',
        content: 'Formal Exegetical Paper on Romans 12:1-2 focusing on historical context and linguistic analysis of "thysian zōsan".',
        fileName: 'Romans12_Exegesis_David_Emmanuel.pdf',
        fileSize: '1.2 MB',
        grade: 96,
        feedback: 'Exemplary exegetical analysis with rich pastoral insight and sound handling of Greek syntax.',
        gradedBy: 'Dr. Thomas E. Wright',
        gradedAt: '2026-08-18',
        status: 'Graded'
      }
    ];
  });

  const [examinations, setExaminations] = useState<Examination[]>(() => {
    const saved = localStorage.getItem('bibu_exams');
    return saved ? JSON.parse(saved) : INITIAL_EXAMINATIONS;
  });

  const [examAttempts, setExamAttempts] = useState<ExamAttempt[]>(() => {
    const saved = localStorage.getItem('bibu_exam_attempts');
    return saved ? JSON.parse(saved) : [];
  });

  const [grades, setGrades] = useState<GradeRecord[]>(() => {
    const saved = localStorage.getItem('bibu_grades');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_GRADES.length) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse bibu_grades', e);
      }
    }
    return INITIAL_GRADES;
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem('bibu_certificates');
    return saved ? JSON.parse(saved) : INITIAL_CERTIFICATES;
  });

  const [libraryResources, setLibraryResources] = useState<LibraryResource[]>(() => {
    const saved = localStorage.getItem('bibu_library');
    return saved ? JSON.parse(saved) : INITIAL_LIBRARY_RESOURCES;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('bibu_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [rplApplications, setRplApplications] = useState<RPLApplication[]>(() => {
    const saved = localStorage.getItem('bibu_rpl');
    return saved ? JSON.parse(saved) : INITIAL_RPL_APPLICATIONS;
  });

  const [rplRecords, setRplRecords] = useState<RPLApplicationRecord[]>(() => {
    const saved = localStorage.getItem('bibu_rpl_records');
    return saved ? JSON.parse(saved) : DETAILED_RPL_APPLICATIONS;
  });

  const [rplProgramRules, setRplProgramRules] = useState<RPLProgramRule[]>(() => {
    const saved = localStorage.getItem('bibu_rpl_program_rules');
    return saved ? JSON.parse(saved) : INITIAL_RPL_PROGRAM_RULES;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('bibu_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [bulletins, setBulletins] = useState<Bulletin[]>(() => {
    const saved = localStorage.getItem('bibu_bulletins');
    return saved ? JSON.parse(saved) : INITIAL_BULLETINS;
  });

  const [bulletinCategories, setBulletinCategories] = useState<BulletinCategory[]>(() => {
    const saved = localStorage.getItem('bibu_bulletin_categories');
    return saved ? JSON.parse(saved) : INITIAL_BULLETIN_CATEGORIES;
  });

  const [bulletinDepartments, setBulletinDepartments] = useState<string[]>(() => {
    const saved = localStorage.getItem('bibu_bulletin_departments');
    return saved ? JSON.parse(saved) : INITIAL_BULLETIN_DEPARTMENTS;
  });

  const [financials, setFinancials] = useState<FinancialTransaction[]>(() => {
    const saved = localStorage.getItem('bibu_financials');
    return saved ? JSON.parse(saved) : INITIAL_FINANCIALS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('bibu_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('bibu_tickets');
    return saved ? JSON.parse(saved) : INITIAL_SUPPORT_TICKETS;
  });

  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('bibu_completed_lessons');
    return saved ? JSON.parse(saved) : ['les-herm-101'];
  });

  const [alumniList, setAlumniList] = useState<Alumni[]>(() => {
    const saved = localStorage.getItem('bibu_alumni_database');
    return saved ? JSON.parse(saved) : INITIAL_ALUMNI_DATABASE;
  });

  // Global Examination Centre & Student Registration System States
  const [kenyaCounties, setKenyaCounties] = useState<KenyaCounty[]>(() => {
    const saved = localStorage.getItem('bibu_kenya_counties');
    return saved ? JSON.parse(saved) : KENYA_47_COUNTIES;
  });

  const [globalCountries, setGlobalCountries] = useState<GlobalCountry[]>(() => {
    const saved = localStorage.getItem('bibu_global_countries');
    return saved ? JSON.parse(saved) : GLOBAL_COUNTRIES;
  });

  const [examinationCentres, setExaminationCentres] = useState<ExaminationCentre[]>(() => {
    const saved = localStorage.getItem('bibu_examination_centres');
    return saved ? JSON.parse(saved) : INITIAL_EXAMINATION_CENTRES;
  });

  const [centreStudents, setCentreStudents] = useState<CentreStudent[]>(() => {
    const saved = localStorage.getItem('bibu_centre_students');
    return saved ? JSON.parse(saved) : INITIAL_CENTRE_STUDENTS;
  });

  const [examSessions, setExamSessions] = useState<ExaminationSession[]>(() => {
    const saved = localStorage.getItem('bibu_exam_sessions');
    return saved ? JSON.parse(saved) : INITIAL_EXAMINATION_SESSIONS;
  });

  const [examAttendanceRecords, setExamAttendanceRecords] = useState<CentreExamAttendanceRecord[]>(() => {
    const saved = localStorage.getItem('bibu_exam_attendance');
    return saved ? JSON.parse(saved) : INITIAL_EXAM_ATTENDANCES;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('bibu_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [selectedCentreId, setSelectedCentreId] = useState<string | null>(null);
  const [selectedCountyCode, setSelectedCountyCode] = useState<number | null>(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);

  // BIBU TV & Radio Media States
  const [mediaChannels, setMediaChannels] = useState<MediaChannel[]>(() => {
    const saved = localStorage.getItem('bibu_media_channels');
    return saved ? JSON.parse(saved) : INITIAL_MEDIA_CHANNELS;
  });

  const [mediaVideos, setMediaVideos] = useState<MediaVideo[]>(() => {
    const saved = localStorage.getItem('bibu_media_videos');
    if (!saved) return INITIAL_MEDIA_VIDEOS;
    try {
      const parsed: MediaVideo[] = JSON.parse(saved);
      // Ensure the official default videos are always present in the library
      const existingIds = new Set(parsed.map(v => v.youtubeVideoId));
      const missingInitial = INITIAL_MEDIA_VIDEOS.filter(v => !existingIds.has(v.youtubeVideoId));
      if (missingInitial.length > 0) {
        return [...missingInitial, ...parsed];
      }
      return parsed;
    } catch {
      return INITIAL_MEDIA_VIDEOS;
    }
  });

  const [mediaPlaylists, setMediaPlaylists] = useState<MediaPlaylist[]>(() => {
    const saved = localStorage.getItem('bibu_media_playlists');
    return saved ? JSON.parse(saved) : INITIAL_MEDIA_PLAYLISTS;
  });

  const [tvPrograms, setTvPrograms] = useState<TVProgram[]>(() => {
    const saved = localStorage.getItem('bibu_tv_programs');
    return saved ? JSON.parse(saved) : INITIAL_TV_PROGRAMS;
  });

  const [radioPrograms, setRadioPrograms] = useState<RadioProgram[]>(() => {
    const saved = localStorage.getItem('bibu_radio_programs');
    return saved ? JSON.parse(saved) : INITIAL_RADIO_SCHEDULE;
  });

  const [radioSettings, setRadioSettings] = useState<RadioSettings>(() => {
    const saved = localStorage.getItem('bibu_radio_settings');
    return saved ? JSON.parse(saved) : INITIAL_RADIO_SETTINGS;
  });

  const [youtubeSettings, setYoutubeSettings] = useState<YouTubeSettings>(() => {
    const saved = localStorage.getItem('bibu_youtube_settings');
    if (!saved) return INITIAL_YOUTUBE_SETTINGS;
    try {
      const parsed: YouTubeSettings = JSON.parse(saved);
      return {
        ...INITIAL_YOUTUBE_SETTINGS,
        ...parsed,
        featuredVideoId: (!parsed.featuredVideoId || parsed.featuredVideoId === 'fJ9rUzIMcZQ') ? 'dMxf_k7q1M4' : parsed.featuredVideoId,
        featuredVideoStartTime: parsed.featuredVideoStartTime || 1642,
        featuredVideoUrl: parsed.featuredVideoUrl || 'https://www.youtube.com/watch?v=dMxf_k7q1M4&t=1642s',
        featuredVideoTitle: parsed.featuredVideoTitle || 'BIBU TV – Breakthrough International Bible University',
        featuredVideoDescription: parsed.featuredVideoDescription || 'Watch sermons, teachings, ministry programs, conferences, interviews and other Christian educational content from Breakthrough International Bible University.'
      };
    } catch {
      return INITIAL_YOUTUBE_SETTINGS;
    }
  });

  const [mediaPresenters, setMediaPresenters] = useState<MediaPresenter[]>(() => {
    const saved = localStorage.getItem('bibu_media_presenters');
    return saved ? JSON.parse(saved) : INITIAL_MEDIA_PRESENTERS;
  });

  const [studentMediaProgress, setStudentMediaProgress] = useState<StudentMediaProgress[]>(() => {
    const saved = localStorage.getItem('bibu_student_media_progress');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_MEDIA_PROGRESS;
  });

  const [mediaAnalytics, setMediaAnalytics] = useState<MediaAnalyticsData>(() => {
    const saved = localStorage.getItem('bibu_media_analytics');
    return saved ? JSON.parse(saved) : INITIAL_MEDIA_ANALYTICS;
  });

  const [activePlayingVideo, setActivePlayingVideo] = useState<MediaVideo | null>(null);
  const [isRadioPlaying, setIsRadioPlaying] = useState<boolean>(false);
  const [radioVolume, setRadioVolume] = useState<number>(85);
  const [isRadioMuted, setIsRadioMuted] = useState<boolean>(false);
  const [selectedMediaCategory, setSelectedMediaCategory] = useState<MediaCategory | 'All'>('All');

  // Graduation Module States
  const [graduationCeremonies, setGraduationCeremonies] = useState<GraduationCeremony[]>(() => {
    const saved = localStorage.getItem('bibu_graduation_ceremonies');
    return saved ? JSON.parse(saved) : INITIAL_GRADUATION_CEREMONIES;
  });

  const [graduationCandidates, setGraduationCandidates] = useState<GraduationCandidate[]>(() => {
    const saved = localStorage.getItem('bibu_graduation_candidates');
    return saved ? JSON.parse(saved) : INITIAL_GRADUATION_CANDIDATES;
  });

  const [graduationBooklets, setGraduationBooklets] = useState<GraduationBooklet[]>(() => {
    const saved = localStorage.getItem('bibu_graduation_booklets');
    return saved ? JSON.parse(saved) : [INITIAL_GRADUATION_BOOKLET];
  });

  const [activeGraduationBooklet, setActiveGraduationBooklet] = useState<GraduationBooklet | null>(() => {
    return graduationBooklets[0] || INITIAL_GRADUATION_BOOKLET;
  });

  const [academicAwards, setAcademicAwards] = useState<AcademicAwardWinner[]>(() => {
    const saved = localStorage.getItem('bibu_academic_awards');
    return saved ? JSON.parse(saved) : INITIAL_ACADEMIC_AWARDS;
  });

  const [graduationCertificates, setGraduationCertificates] = useState<GraduationCertificateRecord[]>(() => {
    const saved = localStorage.getItem('bibu_graduation_certificates');
    return saved ? JSON.parse(saved) : INITIAL_GRADUATION_CERTIFICATES;
  });

  const [graduationAuditLogs, setGraduationAuditLogs] = useState<GraduationAuditLog[]>(() => {
    const saved = localStorage.getItem('bibu_graduation_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_GRADUATION_AUDIT_LOGS;
  });

  // Graduation Local Storage Sync
  useEffect(() => {
    localStorage.setItem('bibu_graduation_ceremonies', JSON.stringify(graduationCeremonies));
  }, [graduationCeremonies]);

  useEffect(() => {
    localStorage.setItem('bibu_graduation_candidates', JSON.stringify(graduationCandidates));
  }, [graduationCandidates]);

  useEffect(() => {
    localStorage.setItem('bibu_graduation_booklets', JSON.stringify(graduationBooklets));
  }, [graduationBooklets]);

  useEffect(() => {
    localStorage.setItem('bibu_academic_awards', JSON.stringify(academicAwards));
  }, [academicAwards]);

  useEffect(() => {
    localStorage.setItem('bibu_graduation_certificates', JSON.stringify(graduationCertificates));
  }, [graduationCertificates]);

  useEffect(() => {
    localStorage.setItem('bibu_graduation_audit_logs', JSON.stringify(graduationAuditLogs));
  }, [graduationAuditLogs]);

  // Media Local Storage Sync
  useEffect(() => {
    localStorage.setItem('bibu_media_channels', JSON.stringify(mediaChannels));
  }, [mediaChannels]);

  useEffect(() => {
    localStorage.setItem('bibu_media_videos', JSON.stringify(mediaVideos));
  }, [mediaVideos]);

  useEffect(() => {
    localStorage.setItem('bibu_media_playlists', JSON.stringify(mediaPlaylists));
  }, [mediaPlaylists]);

  useEffect(() => {
    localStorage.setItem('bibu_tv_programs', JSON.stringify(tvPrograms));
  }, [tvPrograms]);

  useEffect(() => {
    localStorage.setItem('bibu_radio_programs', JSON.stringify(radioPrograms));
  }, [radioPrograms]);

  useEffect(() => {
    localStorage.setItem('bibu_radio_settings', JSON.stringify(radioSettings));
  }, [radioSettings]);

  useEffect(() => {
    localStorage.setItem('bibu_youtube_settings', JSON.stringify(youtubeSettings));
  }, [youtubeSettings]);

  useEffect(() => {
    localStorage.setItem('bibu_media_presenters', JSON.stringify(mediaPresenters));
  }, [mediaPresenters]);

  useEffect(() => {
    localStorage.setItem('bibu_student_media_progress', JSON.stringify(studentMediaProgress));
  }, [studentMediaProgress]);

  useEffect(() => {
    localStorage.setItem('bibu_media_analytics', JSON.stringify(mediaAnalytics));
  }, [mediaAnalytics]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('bibu_kenya_counties', JSON.stringify(kenyaCounties));
  }, [kenyaCounties]);

  useEffect(() => {
    localStorage.setItem('bibu_global_countries', JSON.stringify(globalCountries));
  }, [globalCountries]);

  useEffect(() => {
    localStorage.setItem('bibu_examination_centres', JSON.stringify(examinationCentres));
  }, [examinationCentres]);

  useEffect(() => {
    localStorage.setItem('bibu_centre_students', JSON.stringify(centreStudents));
  }, [centreStudents]);

  useEffect(() => {
    localStorage.setItem('bibu_exam_sessions', JSON.stringify(examSessions));
  }, [examSessions]);

  useEffect(() => {
    localStorage.setItem('bibu_exam_attendance', JSON.stringify(examAttendanceRecords));
  }, [examAttendanceRecords]);

  useEffect(() => {
    localStorage.setItem('bibu_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('bibu_alumni_database', JSON.stringify(alumniList));
  }, [alumniList]);
  useEffect(() => {
    localStorage.setItem('bibu_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('bibu_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('bibu_university_info', JSON.stringify(universityInfo));
  }, [universityInfo]);

  useEffect(() => {
    localStorage.setItem('bibu_completed_lessons', JSON.stringify(completedLessonIds));
  }, [completedLessonIds]);

  useEffect(() => {
    localStorage.setItem('bibu_schools', JSON.stringify(schools));
  }, [schools]);

  useEffect(() => {
    localStorage.setItem('bibu_programs', JSON.stringify(programs));
  }, [programs]);

  useEffect(() => {
    localStorage.setItem('bibu_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('bibu_modules', JSON.stringify(modules));
  }, [modules]);

  useEffect(() => {
    localStorage.setItem('bibu_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('bibu_rpl', JSON.stringify(rplApplications));
  }, [rplApplications]);

  useEffect(() => {
    localStorage.setItem('bibu_rpl_records', JSON.stringify(rplRecords));
  }, [rplRecords]);

  useEffect(() => {
    localStorage.setItem('bibu_rpl_program_rules', JSON.stringify(rplProgramRules));
  }, [rplProgramRules]);

  useEffect(() => {
    localStorage.setItem('bibu_certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('bibu_exam_attempts', JSON.stringify(examAttempts));
  }, [examAttempts]);

  useEffect(() => {
    localStorage.setItem('bibu_exams', JSON.stringify(examinations));
  }, [examinations]);

  useEffect(() => {
    localStorage.setItem('bibu_submissions', JSON.stringify(assignmentSubmissions));
  }, [assignmentSubmissions]);

  useEffect(() => {
    localStorage.setItem('bibu_financials', JSON.stringify(financials));
  }, [financials]);

  useEffect(() => {
    localStorage.setItem('bibu_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('bibu_tickets', JSON.stringify(supportTickets));
  }, [supportTickets]);

  useEffect(() => {
    localStorage.setItem('bibu_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('bibu_bulletins', JSON.stringify(bulletins));
  }, [bulletins]);

  useEffect(() => {
    localStorage.setItem('bibu_bulletin_categories', JSON.stringify(bulletinCategories));
  }, [bulletinCategories]);

  useEffect(() => {
    localStorage.setItem('bibu_bulletin_departments', JSON.stringify(bulletinDepartments));
  }, [bulletinDepartments]);

  useEffect(() => {
    localStorage.setItem('bibu_library', JSON.stringify(libraryResources));
  }, [libraryResources]);

  useEffect(() => {
    localStorage.setItem('bibu_media_videos', JSON.stringify(mediaVideos));
  }, [mediaVideos]);

  useEffect(() => {
    localStorage.setItem('bibu_youtube_settings', JSON.stringify(youtubeSettings));
  }, [youtubeSettings]);

  useEffect(() => {
    localStorage.setItem('bibu_tv_programs', JSON.stringify(tvPrograms));
  }, [tvPrograms]);

  useEffect(() => {
    localStorage.setItem('bibu_radio_programs', JSON.stringify(radioPrograms));
  }, [radioPrograms]);

  useEffect(() => {
    localStorage.setItem('bibu_radio_settings', JSON.stringify(radioSettings));
  }, [radioSettings]);

  // Auth Handlers
  const openAuthModal = (tab: 'login' | 'register' = 'register', targetPortal?: CurrentView, message?: string) => {
    setAuthModalTab(tab);
    setAuthTargetPortal(targetPortal || null);
    setAuthMessage(message || null);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setAuthTargetPortal(null);
    setAuthMessage(null);
  };

  const registerUser = (data: RegisterUserData): { success: boolean; error?: string } => {
    const existing = allUsers.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      return { success: false, error: 'An account with this email address already exists. Please sign in instead.' };
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const generatedId = `usr-${data.role}-${Date.now()}`;
    const generatedStudentId = data.role === 'student' ? `BIBU-${new Date().getFullYear()}-ST-${randomNum}` : undefined;
    const generatedFacultyId = data.role === 'faculty' ? `BIBU-FAC-${randomNum}` : undefined;

    const newUser: User = {
      id: generatedId,
      name: data.name,
      email: data.email,
      password: data.password || 'password123',
      role: data.role,
      country: data.country || 'United States',
      title: data.title || (data.role === 'student' ? 'Student' : data.role === 'faculty' ? 'Instructor' : 'Administrator'),
      studentId: data.studentId || generatedStudentId,
      facultyId: data.facultyId || generatedFacultyId,
      programName: data.programName || (data.role === 'student' ? 'Bachelor of Theology (B.Th)' : undefined),
      programId: data.role === 'student' ? 'prog-bth' : undefined,
      schoolId: data.role === 'student' ? 'sch-theology' : undefined,
      enrolledCourseIds: data.role === 'student' ? ['crs-herm-301', 'crs-theo-201', 'crs-past-401'] : undefined,
      currentSemester: 'Fall 2026',
      admissionYear: new Date().getFullYear(),
      gpa: data.role === 'student' ? 3.9 : undefined,
      creditsEarned: data.role === 'student' ? 12 : undefined,
      totalRequiredCredits: data.role === 'student' ? 120 : undefined,
      financialBalance: 0,
      currency: 'USD',
      ministryAffiliation: data.ministryAffiliation,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setAllUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    closeAuthModal();

    // Direct user to target portal or role-appropriate portal
    if (authTargetPortal) {
      setCurrentView(authTargetPortal);
    } else {
      if (newUser.role === 'student') setCurrentView('student-dashboard');
      else if (newUser.role === 'faculty') setCurrentView('faculty-portal');
      else if (newUser.role === 'admin' || newUser.role === 'registrar') setCurrentView('admin-portal');
      else if (newUser.role === 'alumni') setCurrentView('alumni');
      else setCurrentView('home');
    }

    return { success: true };
  };

  const loginUser = (email: string, password?: string): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const user = allUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return { success: false, error: 'No account found with this email. Please create an account first.' };
    }

    if (password && user.password && user.password !== password) {
      return { success: false, error: 'Incorrect password. Please verify your credentials.' };
    }

    setCurrentUser(user);
    closeAuthModal();

    if (authTargetPortal) {
      setCurrentView(authTargetPortal);
    } else {
      if (user.role === 'student') setCurrentView('student-dashboard');
      else if (user.role === 'faculty') setCurrentView('faculty-portal');
      else if (user.role === 'admin' || user.role === 'registrar') setCurrentView('admin-portal');
      else if (user.role === 'alumni') setCurrentView('alumni');
      else setCurrentView('home');
    }

    return { success: true };
  };

  const logoutUser = () => {
    const guestUser: User = {
      id: 'usr-guest',
      name: 'Guest Visitor',
      email: 'visitor@bibu-edu.org',
      role: 'guest',
      country: 'Global',
    };
    setCurrentUser(guestUser);
    localStorage.removeItem('bibu_current_user');
    setCurrentView('home');
  };

  const requireAuth = (allowedRoles?: Role[], targetView?: CurrentView, message?: string): boolean => {
    if (currentUser.role === 'guest') {
      openAuthModal('register', targetView, message || 'To access this institutional portal, you must first create an account or sign in.');
      return false;
    }

    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
      openAuthModal('login', targetView, `Access restricted. Your current account role (${currentUser.role}) does not have permission for this portal. Please sign into an authorized account.`);
      return false;
    }

    return true;
  };

  // Role Switcher for dev testing / persona switching
  const switchRole = (role: Role) => {
    const target = allUsers.find(u => u.role === role);
    if (target) {
      setCurrentUser(target);
      if (role === 'student') setCurrentView('student-dashboard');
      else if (role === 'faculty') setCurrentView('faculty-portal');
      else if (role === 'registrar' || role === 'admin') setCurrentView('admin-portal');
      else if (role === 'alumni') setCurrentView('alumni');
      else setCurrentView('home');
    } else {
      logoutUser();
    }
  };

  const markLessonComplete = (lessonId: string) => {
    if (!completedLessonIds.includes(lessonId)) {
      setCompletedLessonIds(prev => [...prev, lessonId]);
    }
  };

  // Update University Identity & Global Site Info
  const updateUniversityInfo = (updates: Partial<UniversityInfo>) => {
    setUniversityInfo(prev => ({
      ...prev,
      ...updates
    }));
  };

  // Admissions workflow
  const submitApplication = (appData: Omit<Application, 'id' | 'applicationNumber' | 'status' | 'submittedDate'>): Application => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newApp: Application = {
      ...appData,
      id: `app-${Date.now()}`,
      applicationNumber: `BIBU-APP-2026-${randomNum}`,
      status: 'Submitted',
      submittedDate: new Date().toISOString().split('T')[0],
    };
    setApplications(prev => [newApp, ...prev]);
    return newApp;
  };

  const updateApplicationStatus = (appId: string, status: Application['status'], adminNotes?: string) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status, adminNotes: adminNotes || a.adminNotes } : a));

    // When an application is approved by the Admissions Committee / Registrar, provision or activate student access
    if (status === 'Accepted') {
      const targetApp = applications.find(a => a.id === appId);
      if (targetApp) {
        const prog = programs.find(p => p.id === targetApp.desiredProgramId) || programs[0];
        const programCourses = courses.filter(c => c.programIds?.includes(prog.id) || c.schoolId === prog.schoolId);
        const initialEnrolledIds = programCourses.length > 0 
          ? programCourses.slice(0, 3).map(c => c.id)
          : ['crs-herm-301', 'crs-theo-201', 'crs-past-401'];

        const existingUser = allUsers.find(u => u.email.toLowerCase() === targetApp.email.toLowerCase());
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const newStudentId = `BIBU-${new Date().getFullYear()}-ST-${randomNum}`;

        if (existingUser) {
          const updatedUser: User = {
            ...existingUser,
            role: 'student',
            studentId: existingUser.studentId || newStudentId,
            programId: prog.id,
            programName: prog.name,
            schoolId: prog.schoolId,
            status: 'active',
            verificationStatus: 'verified',
            enrolledCourseIds: existingUser.enrolledCourseIds && existingUser.enrolledCourseIds.length > 0
              ? existingUser.enrolledCourseIds
              : initialEnrolledIds
          };
          setAllUsers(prev => prev.map(u => u.id === existingUser.id ? updatedUser : u));
          if (currentUser.id === existingUser.id) {
            setCurrentUser(updatedUser);
          }
        } else {
          const newStudent: User = {
            id: `usr-student-${Date.now()}`,
            name: targetApp.fullName,
            email: targetApp.email,
            password: 'password123',
            phone: targetApp.phone,
            role: 'student',
            country: targetApp.country,
            title: targetApp.currentMinistryRole || 'Student',
            studentId: newStudentId,
            programId: prog.id,
            programName: prog.name,
            schoolId: prog.schoolId,
            currentSemester: 'Fall 2026',
            admissionYear: new Date().getFullYear(),
            gpa: 4.0,
            creditsEarned: 0,
            totalRequiredCredits: prog.totalCredits,
            financialBalance: 0,
            currency: 'USD',
            ministryAffiliation: targetApp.denomination,
            status: 'active',
            verificationStatus: 'verified',
            enrolledCourseIds: initialEnrolledIds,
            createdAt: new Date().toISOString().split('T')[0]
          };
          setAllUsers(prev => [newStudent, ...prev]);
        }
      }
    }
  };

  const deleteApplication = (appId: string) => {
    setApplications(prev => prev.filter(a => a.id !== appId));
  };

  // RPL Workflow
  const submitRPLApplication = (rplData: Omit<RPLApplication, 'id' | 'applicationNumber' | 'status' | 'dateSubmitted'>): RPLApplication => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const newRPL: RPLApplication = {
      ...rplData,
      id: `rpl-${Date.now()}`,
      applicationNumber: `BIBU-RPL-2026-${randomNum}`,
      status: 'Submitted',
      dateSubmitted: new Date().toISOString().split('T')[0],
    };
    setRplApplications(prev => [newRPL, ...prev]);
    return newRPL;
  };

  const updateRPLStatus = (rplId: string, status: RPLApplication['status'], approvedCredits?: number, notes?: string) => {
    setRplApplications(prev => prev.map(r => r.id === rplId ? {
      ...r,
      status,
      approvedCredits: approvedCredits !== undefined ? approvedCredits : r.approvedCredits,
      assessorNotes: notes || r.assessorNotes,
      assessorName: currentUser.name
    } : r));
  };

  const deleteRPLApplication = (rplId: string) => {
    setRplApplications(prev => prev.filter(r => r.id !== rplId));
  };

  // Detailed Institutional RPL Methods
  const submitDetailedRPLApplication = (
    record: Omit<RPLApplicationRecord, 'id' | 'applicationNumber' | 'verificationCode' | 'submissionDate' | 'status' | 'progressPercentage' | 'approvedCredits' | 'transcriptEntryConfirmed' | 'appeals' | 'auditLogs'>
  ): RPLApplicationRecord => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const verifyHash = Math.floor(10000 + Math.random() * 90000);
    const appNumber = `BIBU-RPL-2026-${randomNum.toString().substring(0, 6)}`;
    const verificationCode = `VRPL-${verifyHash}-AZ`;
    const today = new Date().toISOString().split('T')[0];

    const newRecord: RPLApplicationRecord = {
      ...record,
      id: `rpl-rec-${Date.now()}`,
      applicationNumber: appNumber,
      verificationCode,
      submissionDate: today,
      status: 'Submitted',
      progressPercentage: 25,
      approvedCredits: 0,
      transcriptEntryConfirmed: false,
      appeals: [],
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: `${today} ${new Date().toLocaleTimeString()}`,
          actorName: record.applicantName,
          actorRole: 'Applicant',
          action: 'RPL Portfolio Submitted',
          notes: `Initial submission for ${record.desiredProgramName}. Requested ${record.requestedCredits} credits.`
        }
      ]
    };

    setRplRecords(prev => [newRecord, ...prev]);

    // Also sync to lightweight rplApplications for backwards compatibility
    const compatRpl: RPLApplication = {
      id: newRecord.id,
      applicationNumber: appNumber,
      applicantName: record.applicantName,
      email: record.email,
      phone: record.phone,
      targetProgram: record.desiredProgramName,
      yearsInMinistry: record.yearsInMinistry,
      ministryField: record.currentRole,
      portfolioSummary: record.reflectiveStatements?.callingAndPhilosophy || 'Ministerial Prior Learning Portfolio',
      evidenceItems: (record.evidenceList || []).map(e => ({
        title: e.title,
        category: e.type,
        description: e.description
      })),
      requestedCredits: record.requestedCredits,
      approvedCredits: 0,
      status: 'Submitted',
      dateSubmitted: today
    };
    setRplApplications(prev => [compatRpl, ...prev]);

    return newRecord;
  };

  const updateRPLRecord = (id: string, updates: Partial<RPLApplicationRecord>) => {
    setRplRecords(prev => prev.map(rec => {
      if (rec.id !== id) return rec;
      const updated = { ...rec, ...updates };
      return updated;
    }));
  };

  const deleteRPLRecord = (id: string) => {
    setRplRecords(prev => prev.filter(r => r.id !== id));
    setRplApplications(prev => prev.filter(r => r.id !== id));
  };

  const assessRPLCompetency = (
    rplId: string,
    compId: string,
    decision: RPLCompetencyItem['assessorDecision'],
    awardedCredits: number,
    notes?: string
  ) => {
    setRplRecords(prev => prev.map(rec => {
      if (rec.id !== rplId) return rec;
      const updatedCompetencies = rec.competencies.map(c => {
        if (c.id !== compId) return c;
        return {
          ...c,
          assessorDecision: decision,
          awardedCredits: decision === 'Credit Awarded' || decision === 'Partial Credit' ? awardedCredits : 0,
          assessorNotes: notes || c.assessorNotes
        };
      });

      const totalCreditsAwarded = updatedCompetencies.reduce((sum, c) => sum + (c.awardedCredits || 0), 0);

      return {
        ...rec,
        competencies: updatedCompetencies,
        approvedCredits: totalCreditsAwarded,
        auditLogs: [
          {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            actorName: currentUser.name,
            actorRole: currentUser.role === 'admin' || currentUser.role === 'superadmin' ? 'Academic Dean' : 'RPL Assessor',
            action: `Competency Evaluated: ${compId}`,
            notes: `Decision: ${decision}, Credits: ${awardedCredits}`
          },
          ...rec.auditLogs
        ]
      };
    }));
  };

  const scheduleRPLInterview = (rplId: string, interviewDate: string, notes?: string) => {
    setRplRecords(prev => prev.map(rec => {
      if (rec.id !== rplId) return rec;
      return {
        ...rec,
        interviewScheduledDate: interviewDate,
        status: 'Interview Scheduled',
        progressPercentage: 60,
        interviewNotes: notes || rec.interviewNotes,
        auditLogs: [
          {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            actorName: currentUser.name,
            actorRole: 'RPL Coordinator',
            action: 'Assessor Interview Scheduled',
            notes: `Scheduled for ${interviewDate}. ${notes || ''}`
          },
          ...rec.auditLogs
        ]
      };
    }));
  };

  const finalizeRPLAssessment = (
    rplId: string,
    status: RPLStatus,
    approvedCredits: number,
    notes: string,
    methods: RPLAssessmentMethod[]
  ) => {
    const today = new Date().toISOString().split('T')[0];
    setRplRecords(prev => prev.map(rec => {
      if (rec.id !== rplId) return rec;
      const isApproved = status === 'Credit Approved' || status === 'Credit Partially Approved';
      return {
        ...rec,
        status,
        approvedCredits,
        assessorNotes: notes,
        assessorName: currentUser.name,
        assessorId: currentUser.id,
        assessmentDate: today,
        assessmentMethodsUsed: methods,
        progressPercentage: isApproved ? 100 : 90,
        academicDeanApprovalDate: isApproved ? today : rec.academicDeanApprovalDate,
        auditLogs: [
          {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            actorName: currentUser.name,
            actorRole: 'Academic Assessor',
            action: `Assessment Decision: ${status}`,
            notes: `Awarded ${approvedCredits} credits. Assessor notes: ${notes}`
          },
          ...rec.auditLogs
        ]
      };
    }));

    // Update matching compat record
    setRplApplications(prev => prev.map(r => r.id === rplId ? {
      ...r,
      status: (status === 'Credit Approved' ? 'Credits Awarded' : status === 'Credit Not Approved' ? 'Rejected' : 'Portfolio Review') as RPLApplication['status'],
      approvedCredits,
      assessorNotes: notes,
      assessorName: currentUser.name
    } : r));
  };

  const submitRPLAppeal = (
    rplId: string,
    appeal: { groundsForAppeal: string; applicantStatement: string; supportingEvidenceNotes: string }
  ) => {
    const today = new Date().toISOString().split('T')[0];
    setRplRecords(prev => prev.map(rec => {
      if (rec.id !== rplId) return rec;
      const newAppeal = {
        id: `app-${Date.now()}`,
        dateSubmitted: today,
        groundsForAppeal: appeal.groundsForAppeal,
        applicantStatement: appeal.applicantStatement,
        supportingEvidenceNotes: appeal.supportingEvidenceNotes,
        status: 'Submitted' as const
      };
      return {
        ...rec,
        status: 'Appeal',
        appeals: [newAppeal, ...rec.appeals],
        auditLogs: [
          {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            actorName: rec.applicantName,
            actorRole: 'Applicant',
            action: 'RPL Appeal Lodged',
            notes: `Grounds: ${appeal.groundsForAppeal.substring(0, 80)}...`
          },
          ...rec.auditLogs
        ]
      };
    }));
  };

  const syncRPLToTranscript = (rplId: string): { success: boolean; message: string; creditsConferred: number } => {
    const rec = rplRecords.find(r => r.id === rplId);
    if (!rec) {
      return { success: false, message: 'RPL Record not found', creditsConferred: 0 };
    }
    if (rec.approvedCredits <= 0) {
      return { success: false, message: 'No credits have been approved for this RPL portfolio.', creditsConferred: 0 };
    }

    const studentUser = allUsers.find(u => u.studentId === rec.studentId || u.email === rec.email || u.id === rec.userId) || currentUser;

    // Create GradeRecords for the awarded competencies
    const newGrades: GradeRecord[] = rec.competencies
      .filter(c => (c.awardedCredits || 0) > 0)
      .map(c => ({
        id: `grd-rpl-${c.id}-${Date.now()}`,
        studentId: studentUser.studentId || studentUser.id,
        courseId: `crs-${c.courseCode.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        courseCode: c.courseCode,
        courseTitle: c.courseTitle,
        creditHours: c.awardedCredits || c.creditValue,
        semester: 'Prior Learning Assessment (RPL)',
        year: 2026,
        assignmentScore: 95,
        quizScore: 95,
        examScore: 95,
        totalScore: 95,
        letterGrade: 'A',
        gradePoint: 4.0
      }));

    if (newGrades.length > 0) {
      setGrades(prev => [...newGrades, ...prev]);
    }

    // Update user credits earned
    setAllUsers(prev => prev.map(u => {
      if (u.id === studentUser.id || u.studentId === studentUser.studentId) {
        return {
          ...u,
          creditsEarned: (u.creditsEarned || 0) + rec.approvedCredits
        };
      }
      return u;
    }));

    if (currentUser.id === studentUser.id || currentUser.studentId === studentUser.studentId) {
      setCurrentUser(prev => ({
        ...prev,
        creditsEarned: (prev.creditsEarned || 0) + rec.approvedCredits
      }));
    }

    // Mark as transcript recorded
    setRplRecords(prev => prev.map(r => r.id === rplId ? {
      ...r,
      transcriptEntryConfirmed: true,
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          actorName: currentUser.name,
          actorRole: 'Registrar',
          action: 'RPL Academic Credits Conferred to Student Transcript',
          notes: `Conferred ${rec.approvedCredits} credits across ${newGrades.length} courses.`
        },
        ...r.auditLogs
      ]
    } : r));

    return {
      success: true,
      message: `Successfully synchronized and recorded ${rec.approvedCredits} RPL credits to the official Student Academic Record (${studentUser.name} - ${studentUser.studentId || 'SIS'}).`,
      creditsConferred: rec.approvedCredits
    };
  };

  const verifyRPLCode = (code: string): RPLApplicationRecord | undefined => {
    if (!code) return undefined;
    const clean = code.trim().toUpperCase();
    return rplRecords.find(r => 
      r.applicationNumber.toUpperCase() === clean ||
      r.verificationCode.toUpperCase() === clean ||
      r.id.toUpperCase() === clean
    );
  };

  const updateRPLProgramRules = (rules: RPLProgramRule[]) => {
    setRplProgramRules(rules);
  };

  // Assignment Handlers
  const submitAssignment = (assignmentId: string, content: string, fileName?: string) => {
    const newSubmission: AssignmentSubmission = {
      id: `sub-${Date.now()}`,
      assignmentId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      content,
      fileName: fileName || 'Theological_Research_Paper.pdf',
      fileSize: '1.4 MB',
      status: 'Submitted'
    };
    setAssignmentSubmissions(prev => [newSubmission, ...prev]);
  };

  const gradeAssignment = (submissionId: string, grade: number, feedback: string) => {
    setAssignmentSubmissions(prev => prev.map(s => s.id === submissionId ? {
      ...s,
      grade,
      feedback,
      gradedBy: currentUser.name,
      gradedAt: new Date().toISOString().split('T')[0],
      status: 'Graded'
    } : s));
  };

  // Online Exam Taking
  const submitExamAttempt = (examId: string, answers: { [qId: string]: string | number }, score: number, percentage: number, grade: string) => {
    const newAttempt: ExamAttempt = {
      id: `att-${Date.now()}`,
      examId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      startedAt: new Date(Date.now() - 30 * 60000).toISOString(),
      completedAt: new Date().toISOString(),
      score,
      percentage,
      grade,
      answers,
      status: 'Graded',
      examinerComments: 'Auto-graded by BIBU Central Examination System.'
    };
    setExamAttempts(prev => [newAttempt, ...prev]);

    // Also record grade
    const targetExam = examinations.find(e => e.id === examId);
    if (targetExam) {
      const letter = percentage >= 90 ? 'A' : percentage >= 85 ? 'A-' : percentage >= 80 ? 'B+' : percentage >= 75 ? 'B' : percentage >= 70 ? 'C+' : 'F';
      const gradePoint = percentage >= 90 ? 4.0 : percentage >= 85 ? 3.7 : percentage >= 80 ? 3.3 : percentage >= 75 ? 3.0 : 2.0;

      const newGrade: GradeRecord = {
        id: `grd-${Date.now()}`,
        studentId: currentUser.id,
        courseId: targetExam.courseId,
        courseCode: targetExam.courseCode,
        courseTitle: targetExam.courseTitle,
        creditHours: 3,
        semester: 'Fall 2026',
        year: 2026,
        assignmentScore: 92,
        quizScore: 90,
        examScore: score,
        totalScore: Math.round((92 * 0.3) + (90 * 0.2) + (score * 0.5)),
        letterGrade: letter as GradeRecord['letterGrade'],
        gradePoint: gradePoint
      };
      setGrades(prev => [newGrade, ...prev]);
    }
  };

  const moderateExamAttempt = (attemptId: string, comments: string, adjustedScore?: number) => {
    setExamAttempts(prev => prev.map(a => a.id === attemptId ? {
      ...a,
      status: 'Moderated',
      examinerComments: comments,
      score: adjustedScore !== undefined ? adjustedScore : a.score
    } : a));
  };

  // Financials & Invoices
  const payInvoice = (invoiceId: string, method: string = 'Credit Card (Online)') => {
    setInvoices(prev => prev.map(f => f.id === invoiceId ? { ...f, status: 'Paid', paymentMethod: method, paidDate: new Date().toISOString().split('T')[0] } : f));
    setFinancials(prev => prev.map(f => f.invoiceNumber === invoiceId || f.id === invoiceId ? { ...f, status: 'Paid', paymentMethod: method } : f));
    
    // Update student balance
    setCurrentUser(prev => ({
      ...prev,
      financialBalance: 0
    }));
  };

  const createInvoice = (inv: Omit<Invoice, 'id' | 'invoiceNumber'>): Invoice => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newInv: Invoice = {
      ...inv,
      id: `inv-${Date.now()}`,
      invoiceNumber: `BIBU-INV-2026-${randomNum}`,
    };
    setInvoices(prev => [newInv, ...prev]);
    return newInv;
  };

  const updateInvoiceStatus = (id: string, status: Invoice['status']) => {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(i => i.id !== id));
  };

  // Support Tickets
  const createSupportTicket = (category: SupportTicket['category'], subject: string, message: string, priority: SupportTicket['priority']) => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newTkt: SupportTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: `TKT-${randomCode}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      category,
      subject,
      message,
      priority,
      status: 'Open',
      createdAt: new Date().toISOString().split('T')[0],
      responses: []
    };
    setSupportTickets(prev => [newTkt, ...prev]);
  };

  const replySupportTicket = (ticketId: string, message: string) => {
    setSupportTickets(prev => prev.map(t => t.id === ticketId ? {
      ...t,
      status: 'In Progress',
      responses: [
        ...t.responses,
        {
          sender: currentUser.name,
          message,
          date: new Date().toISOString().split('T')[0],
          isStaff: currentUser.role === 'faculty' || currentUser.role === 'admin' || currentUser.role === 'registrar'
        }
      ]
    } : t));
  };

  // Super Admin CMS CRUD: Schools
  const addSchool = (school: Omit<School, 'id'>): School => {
    const newSchool: School = {
      ...school,
      id: `sch-${Date.now()}`
    };
    setSchools(prev => [...prev, newSchool]);
    return newSchool;
  };

  const updateSchool = (id: string, updates: Partial<School>) => {
    setSchools(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSchool = (id: string) => {
    setSchools(prev => prev.filter(s => s.id !== id));
  };

  // Super Admin CMS CRUD: Programs
  const addProgram = (program: Omit<Program, 'id'>): Program => {
    const newProg: Program = {
      ...program,
      id: `prog-${Date.now()}`
    };
    setPrograms(prev => [...prev, newProg]);
    return newProg;
  };

  const updateProgram = (id: string, updates: Partial<Program>) => {
    setPrograms(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProgram = (id: string) => {
    setPrograms(prev => prev.filter(p => p.id !== id));
  };

  // Super Admin CMS CRUD: Courses
  const addCourse = (course: Omit<Course, 'id'>): Course => {
    const newCourse: Course = {
      ...course,
      id: `crs-${Date.now()}`
    };
    setCourses(prev => [...prev, newCourse]);
    return newCourse;
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  // Super Admin CMS CRUD: Modules & Lessons
  const addModule = (courseId: string, title: string, description: string): Module => {
    const newMod: Module = {
      id: `mod-${Date.now()}`,
      courseId,
      order: modules.filter(m => m.courseId === courseId).length + 1,
      title,
      description,
      lessons: []
    };
    setModules(prev => [...prev, newMod]);
    return newMod;
  };

  const updateModule = (id: string, updates: Partial<Module>) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const deleteModule = (id: string) => {
    setModules(prev => prev.filter(m => m.id !== id));
  };

  const addLesson = (moduleId: string, lesson: Omit<Lesson, 'id'>): Lesson => {
    const newLesson: Lesson = {
      ...lesson,
      id: `les-${Date.now()}`
    };
    setModules(prev => prev.map(m => m.id === moduleId ? {
      ...m,
      lessons: [...m.lessons, newLesson]
    } : m));
    return newLesson;
  };

  const updateLesson = (moduleId: string, lessonId: string, updates: Partial<Lesson>) => {
    setModules(prev => prev.map(m => m.id === moduleId ? {
      ...m,
      lessons: m.lessons.map(l => l.id === lessonId ? { ...l, ...updates } : l)
    } : m));
  };

  const deleteLesson = (moduleId: string, lessonId: string) => {
    setModules(prev => prev.map(m => m.id === moduleId ? {
      ...m,
      lessons: m.lessons.filter(l => l.id !== lessonId)
    } : m));
  };

  // Super Admin CMS CRUD: Examinations & Questions
  const addQuestionToBank = (question: Omit<Question, 'id'>) => {
    const newQ: Question = {
      ...question,
      id: `q-${Date.now()}`
    };
    setExaminations(prev => prev.map(e => e.id === 'exam-herm-mid' ? {
      ...e,
      questions: [...e.questions, newQ]
    } : e));
  };

  const createExam = (exam: Omit<Examination, 'id'>): Examination => {
    const newExam: Examination = {
      ...exam,
      id: `exam-${Date.now()}`
    };
    setExaminations(prev => [...prev, newExam]);
    return newExam;
  };

  const updateExam = (id: string, updates: Partial<Examination>) => {
    setExaminations(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteExam = (id: string) => {
    setExaminations(prev => prev.filter(e => e.id !== id));
  };

  const addQuestionToExam = (examId: string, question: Omit<Question, 'id'>) => {
    const newQ: Question = {
      ...question,
      id: `q-${Date.now()}`
    };
    setExaminations(prev => prev.map(e => e.id === examId ? {
      ...e,
      questions: [...e.questions, newQ]
    } : e));
  };

  const updateQuestionInExam = (examId: string, questionId: string, updates: Partial<Question>) => {
    setExaminations(prev => prev.map(e => e.id === examId ? {
      ...e,
      questions: e.questions.map(q => q.id === questionId ? { ...q, ...updates } : q)
    } : e));
  };

  const deleteQuestionFromExam = (examId: string, questionId: string) => {
    setExaminations(prev => prev.map(e => e.id === examId ? {
      ...e,
      questions: e.questions.filter(q => q.id !== questionId)
    } : e));
  };

  // Super Admin CMS CRUD: Certificates
  const createCertificate = (cert: Omit<Certificate, 'id' | 'verificationCode'>): Certificate => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newCert: Certificate = {
      ...cert,
      id: `cert-${Date.now()}`,
      verificationCode: `VRF-${randomCode}-AZ`
    };
    setCertificates(prev => [newCert, ...prev]);
    return newCert;
  };

  const issueCertificate = (certData: {
    studentName: string;
    studentId: string;
    degreeTitle: string;
    schoolName: string;
    honors?: string;
    chancellorName?: string;
    registrarName?: string;
  }): Certificate => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newCert: Certificate = {
      id: `cert-${Date.now()}`,
      certificateNumber: `BIBU-2026-DEG-${randomNum}`,
      studentId: certData.studentId,
      studentName: certData.studentName,
      programName: certData.degreeTitle,
      degreeTitle: certData.degreeTitle,
      schoolName: certData.schoolName,
      conferralDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      honors: certData.honors || 'Summa Cum Laude',
      verificationCode: `VRF-${randomCode}-AZ`,
      status: 'Valid',
      chancellorName: certData.chancellorName || universityInfo.chancellor,
      registrarName: certData.registrarName || universityInfo.registrar,
    };
    setCertificates(prev => [newCert, ...prev]);
    return newCert;
  };

  const updateCertificate = (id: string, updates: Partial<Certificate>) => {
    setCertificates(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const revokeCertificate = (id: string) => {
    setCertificates(prev => prev.map(c => c.id === id ? { ...c, status: 'Revoked' } : c));
  };

  const reinstateCertificate = (id: string) => {
    setCertificates(prev => prev.map(c => c.id === id ? { ...c, status: 'Valid' } : c));
  };

  const deleteCertificate = (id: string) => {
    setCertificates(prev => prev.filter(c => c.id !== id));
  };

  // Super Admin CMS CRUD: Library Resources
  const addLibraryResource = (resource: Omit<LibraryResource, 'id'>): LibraryResource => {
    const newResource: LibraryResource = {
      ...resource,
      id: `lib-${Date.now()}`
    };
    setLibraryResources(prev => [newResource, ...prev]);
    return newResource;
  };

  const updateLibraryResource = (id: string, updates: Partial<LibraryResource>) => {
    setLibraryResources(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteLibraryResource = (id: string) => {
    setLibraryResources(prev => prev.filter(r => r.id !== id));
  };

  // Super Admin CMS CRUD: Announcements
  const addAnnouncement = (announcement: Omit<Announcement, 'id'>): Announcement => {
    const newAnn: Announcement = {
      ...announcement,
      id: `ann-${Date.now()}`
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    return newAnn;
  };

  const updateAnnouncement = (id: string, updates: Partial<Announcement>) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  // Super Admin & Faculty: University Bulletins & Announcements System
  const createBulletin = (data: Partial<Bulletin>): Bulletin => {
    const currentYr = data.year || new Date().getFullYear();
    const existingForYear = bulletins.filter(b => b.year === currentYr);
    const nextSeq = existingForYear.length + 1;
    const formattedNum = `BIBU/BUL/${currentYr}/${String(nextSeq).padStart(3, '0')}`;
    const vrfRandom = Math.floor(100000 + Math.random() * 900000);
    const vrfCode = `BIBU-VRF-${currentYr}-${vrfRandom}`;
    const authorName = data.author || currentUser.name || 'Office of the Registrar';

    const newBul: Bulletin = {
      id: `bul-${Date.now()}`,
      bulletinNumber: data.bulletinNumber || formattedNum,
      verificationCode: data.verificationCode || vrfCode,
      title: data.title || 'Untitled University Bulletin',
      subtitle: data.subtitle || '',
      category: data.category || 'University News',
      department: data.department || "Registrar's Office",
      author: authorName,
      authorRole: data.authorRole || (currentUser.role === 'Super Admin' ? 'Executive Administrator' : 'Academic Officer'),
      priority: data.priority || 'Normal',
      targetAudience: data.targetAudience || 'Everyone',
      status: data.status || 'Draft',
      publishDate: data.publishDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      publishTime: data.publishTime || '09:00 AM MST',
      scheduledDate: data.scheduledDate,
      expiryDate: data.expiryDate,
      featuredImage: data.featuredImage || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
      summary: data.summary || '',
      content: data.content || '',
      importantDates: data.importantDates || [],
      instructions: data.instructions || [],
      attachments: data.attachments || [],
      links: data.links || [],
      contactInfo: data.contactInfo || {
        department: data.department || "Registrar's Office",
        email: 'bulletins@bibu-edu.org',
        phone: '+1 (602) 845-9200'
      },
      eventDetails: data.eventDetails,
      viewsCount: 0,
      downloadsCount: 0,
      isFeatured: !!data.isFeatured,
      year: currentYr,
      authorizedSignatory: data.authorizedSignatory || {
        name: universityInfo.registrar,
        title: 'University Academic Registrar',
        signatureText: 'S. M. Jenkins, Th.D.'
      },
      createdAt: new Date().toISOString(),
      createdBy: authorName,
      approvedBy: data.status === 'Published' ? (currentUser.name || 'Dr. Michael C. Sterling') : undefined,
      approvedAt: data.status === 'Published' ? new Date().toISOString() : undefined,
      auditLogs: [
        {
          action: 'Created',
          user: currentUser.name || authorName,
          userRole: currentUser.role,
          timestamp: new Date().toLocaleString(),
          notes: `Bulletin created with initial status: ${data.status || 'Draft'}`
        }
      ]
    };

    setBulletins(prev => [newBul, ...prev]);
    return newBul;
  };

  const updateBulletin = (id: string, updates: Partial<Bulletin>) => {
    setBulletins(prev => prev.map(b => {
      if (b.id !== id) return b;
      const updatedAudit: Bulletin['auditLogs'] = [
        ...b.auditLogs,
        {
          action: 'Edited',
          user: currentUser.name,
          userRole: currentUser.role,
          timestamp: new Date().toLocaleString(),
          notes: 'Bulletin content or metadata updated'
        }
      ];
      return {
        ...b,
        ...updates,
        auditLogs: updatedAudit
      };
    }));
  };

  const approveBulletin = (id: string, approverName?: string) => {
    const approver = approverName || currentUser.name;
    setBulletins(prev => prev.map(b => {
      if (b.id !== id) return b;
      return {
        ...b,
        status: 'Approved',
        approvedBy: approver,
        approvedAt: new Date().toISOString(),
        auditLogs: [
          ...b.auditLogs,
          {
            action: 'Approved',
            user: approver,
            userRole: currentUser.role,
            timestamp: new Date().toLocaleString(),
            notes: 'Official administrative approval recorded'
          }
        ]
      };
    }));
  };

  const publishBulletin = (id: string, publisherName?: string) => {
    const publisher = publisherName || currentUser.name;
    setBulletins(prev => prev.map(b => {
      if (b.id !== id) return b;
      return {
        ...b,
        status: 'Published',
        publishDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        auditLogs: [
          ...b.auditLogs,
          {
            action: 'Published',
            user: publisher,
            userRole: currentUser.role,
            timestamp: new Date().toLocaleString(),
            notes: 'Bulletin broadcasted to university portal and subscriber network'
          }
        ]
      };
    }));
  };

  const unpublishBulletin = (id: string, userName?: string) => {
    const user = userName || currentUser.name;
    setBulletins(prev => prev.map(b => {
      if (b.id !== id) return b;
      return {
        ...b,
        status: 'Draft',
        auditLogs: [
          ...b.auditLogs,
          {
            action: 'Unpublished',
            user,
            userRole: currentUser.role,
            timestamp: new Date().toLocaleString(),
            notes: 'Bulletin recalled to Draft status'
          }
        ]
      };
    }));
  };

  const archiveBulletin = (id: string, userName?: string) => {
    const user = userName || currentUser.name;
    setBulletins(prev => prev.map(b => {
      if (b.id !== id) return b;
      return {
        ...b,
        status: 'Archived',
        auditLogs: [
          ...b.auditLogs,
          {
            action: 'Archived',
            user,
            userRole: currentUser.role,
            timestamp: new Date().toLocaleString(),
            notes: 'Bulletin moved to permanent institutional archive'
          }
        ]
      };
    }));
  };

  const duplicateBulletin = (id: string, userName?: string): Bulletin => {
    const original = bulletins.find(b => b.id === id);
    const user = userName || currentUser.name;
    const currentYr = new Date().getFullYear();
    const existingForYear = bulletins.filter(b => b.year === currentYr);
    const nextSeq = existingForYear.length + 1;
    const formattedNum = `BIBU/BUL/${currentYr}/${String(nextSeq).padStart(3, '0')}`;
    const vrfRandom = Math.floor(100000 + Math.random() * 900000);
    const vrfCode = `BIBU-VRF-${currentYr}-${vrfRandom}`;

    const dup: Bulletin = {
      ...(original || INITIAL_BULLETINS[0]),
      id: `bul-${Date.now()}`,
      bulletinNumber: formattedNum,
      verificationCode: vrfCode,
      title: `(Copy) ${original ? original.title : 'Bulletin'}`,
      status: 'Draft',
      viewsCount: 0,
      downloadsCount: 0,
      createdAt: new Date().toISOString(),
      createdBy: user,
      approvedBy: undefined,
      approvedAt: undefined,
      auditLogs: [
        {
          action: 'Duplicate',
          user,
          userRole: currentUser.role,
          timestamp: new Date().toLocaleString(),
          notes: `Duplicated from ${original?.bulletinNumber || id}`
        }
      ]
    };

    setBulletins(prev => [dup, ...prev]);
    return dup;
  };

  const deleteBulletin = (id: string) => {
    setBulletins(prev => prev.filter(b => b.id !== id));
  };

  const recordBulletinView = (id: string) => {
    setBulletins(prev => prev.map(b => b.id === id ? { ...b, viewsCount: b.viewsCount + 1 } : b));
  };

  const recordBulletinDownload = (id: string) => {
    setBulletins(prev => prev.map(b => b.id === id ? { ...b, downloadsCount: b.downloadsCount + 1 } : b));
  };

  const verifyBulletinCode = (code: string): Bulletin | undefined => {
    if (!code) return undefined;
    const clean = code.trim().toLowerCase();
    return bulletins.find(b =>
      b.verificationCode.toLowerCase() === clean ||
      b.bulletinNumber.toLowerCase() === clean ||
      b.id.toLowerCase() === clean
    );
  };

  const addBulletinCategory = (category: string) => {
    if (!category.trim()) return;
    if (!bulletinCategories.includes(category.trim())) {
      setBulletinCategories(prev => [...prev, category.trim()]);
    }
  };

  const addBulletinDepartment = (department: string) => {
    if (!department.trim()) return;
    if (!bulletinDepartments.includes(department.trim())) {
      setBulletinDepartments(prev => [...prev, department.trim()]);
    }
  };

  // Enrolment & Student Course Access Control
  const enrollStudentInCourse = (studentId: string, courseId: string) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === studentId || u.studentId === studentId) {
        const current = u.enrolledCourseIds || [];
        if (!current.includes(courseId)) {
          return { ...u, enrolledCourseIds: [...current, courseId] };
        }
      }
      return u;
    }));
    if (currentUser.id === studentId || currentUser.studentId === studentId) {
      setCurrentUser(prev => {
        const current = prev.enrolledCourseIds || [];
        if (!current.includes(courseId)) {
          return { ...prev, enrolledCourseIds: [...current, courseId] };
        }
        return prev;
      });
    }
  };

  const unenrollStudentFromCourse = (studentId: string, courseId: string) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === studentId || u.studentId === studentId) {
        const current = u.enrolledCourseIds || [];
        return { ...u, enrolledCourseIds: current.filter(id => id !== courseId) };
      }
      return u;
    }));
    if (currentUser.id === studentId || currentUser.studentId === studentId) {
      setCurrentUser(prev => {
        const current = prev.enrolledCourseIds || [];
        return { ...prev, enrolledCourseIds: current.filter(id => id !== courseId) };
      });
    }
  };

  const assignStudentProgram = (studentId: string, programId: string) => {
    const prog = programs.find(p => p.id === programId);
    if (!prog) return;
    const progCourses = courses.filter(c => c.programIds?.includes(programId) || c.schoolId === prog.schoolId);
    const defaultCourseIds = progCourses.slice(0, 3).map(c => c.id);

    setAllUsers(prev => prev.map(u => {
      if (u.id === studentId || u.studentId === studentId) {
        return {
          ...u,
          programId: prog.id,
          programName: prog.name,
          schoolId: prog.schoolId,
          enrolledCourseIds: u.enrolledCourseIds && u.enrolledCourseIds.length > 0 ? u.enrolledCourseIds : defaultCourseIds
        };
      }
      return u;
    }));
    if (currentUser.id === studentId || currentUser.studentId === studentId) {
      setCurrentUser(prev => ({
        ...prev,
        programId: prog.id,
        programName: prog.name,
        schoolId: prog.schoolId,
        enrolledCourseIds: prev.enrolledCourseIds && prev.enrolledCourseIds.length > 0 ? prev.enrolledCourseIds : defaultCourseIds
      }));
    }
  };

  const isStudentEnrolledInCourse = (courseId: string, userParam?: User): boolean => {
    const user = userParam || currentUser;
    if (!user || user.role === 'guest') return false;
    if (['faculty', 'admin', 'registrar', 'superadmin', 'examiner', 'moderator'].includes(user.role)) {
      return true;
    }
    if (user.enrolledCourseIds && Array.isArray(user.enrolledCourseIds)) {
      return user.enrolledCourseIds.includes(courseId);
    }
    if (user.role === 'student') {
      if (user.programId) {
        const course = courses.find(c => c.id === courseId);
        if (course && course.programIds?.includes(user.programId)) {
          return true;
        }
      }
      if (['crs-herm-301', 'crs-theo-201', 'crs-past-401'].includes(courseId)) {
        return true;
      }
    }
    return false;
  };

  const getStudentEnrolledCourses = (userParam?: User): Course[] => {
    const user = userParam || currentUser;
    if (!user || user.role === 'guest') return [];
    if (['faculty', 'admin', 'registrar', 'superadmin'].includes(user.role)) {
      return courses;
    }
    if (user.enrolledCourseIds && user.enrolledCourseIds.length > 0) {
      return courses.filter(c => user.enrolledCourseIds!.includes(c.id));
    }
    if (user.programId) {
      const progCourses = courses.filter(c => c.programIds?.includes(user.programId!));
      if (progCourses.length > 0) return progCourses;
    }
    if (user.role === 'student') {
      return courses.slice(0, 3);
    }
    return [];
  };

  const requestCourseEnrolment = (
    courseId: string,
    reason?: string,
    term: string = 'Fall Semester 2026',
    studyMode: string = 'Standard Online Academic Track'
  ): { success: boolean; message: string; ticketNumber: string } => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return { success: false, message: 'Course not found.', ticketNumber: '' };

    const randomNum = Math.floor(100 + Math.random() * 900);
    const ticketNumber = `BIBU-ENROL-2026-${randomNum}`;
    const newTicket: SupportTicket = {
      id: `tkt-enrol-${Date.now()}`,
      ticketNumber,
      studentId: currentUser.id,
      studentName: currentUser.name,
      category: 'Academic Advising',
      subject: `Course Enrolment Request: ${course.code} - ${course.title}`,
      message: `Student ${currentUser.name} (${currentUser.studentId || currentUser.email}) has formally submitted a course enrolment request for ${course.code}: ${course.title}.\n\nAcademic Details:\n- Selected Term: ${term}\n- Study Mode: ${studyMode}\n- Registered Programme: ${currentUser.programName || 'Theology Degree Pathway'}\n- Student ID: ${currentUser.studentId || 'Pending'}\n- Academic Credits: ${course.creditHours} Credits\n- Theological Justification / Notes: ${reason || 'Standard curriculum course access request.'}`,
      status: 'Open',
      priority: 'Medium',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      responses: [
        {
          sender: "Office of the Academic Registrar",
          message: `Enrolment application received and assigned reference #${ticketNumber}. The Registrar Academic Committee evaluates prerequisite standing and curriculum load. Please monitor this portal for status confirmation within 24-48 business hours.`,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          isStaff: true
        }
      ]
    };

    setSupportTickets(prev => [newTicket, ...prev]);

    return {
      success: true,
      message: `Enrolment request for ${course.code} (${course.title}) has been submitted to the University Registrar's office (Ref: ${ticketNumber}).`,
      ticketNumber
    };
  };

  const requestModuleEnrolment = (
    courseId: string,
    moduleId: string,
    reason?: string,
    term: string = 'Fall Semester 2026'
  ): { success: boolean; message: string; ticketNumber: string } => {
    const course = courses.find(c => c.id === courseId);
    const mod = modules.find(m => m.id === moduleId && m.courseId === courseId);
    if (!course) return { success: false, message: 'Course not found.', ticketNumber: '' };

    const moduleTitle = mod ? mod.title : `Module ID: ${moduleId}`;
    const randomNum = Math.floor(100 + Math.random() * 900);
    const ticketNumber = `BIBU-MOD-2026-${randomNum}`;
    const newTicket: SupportTicket = {
      id: `tkt-mod-${Date.now()}`,
      ticketNumber,
      studentId: currentUser.id,
      studentName: currentUser.name,
      category: 'Academic Advising',
      subject: `Module Enrolment Request: ${course.code} [${moduleTitle}]`,
      message: `Student ${currentUser.name} (${currentUser.studentId || currentUser.email}) has requested targeted enrolment in a specific instructional module under ${course.code}: ${course.title}.\n\nModule Requested: ${moduleTitle}\nTerm: ${term}\nRegistered Programme: ${currentUser.programName || 'Theology Degree Pathway'}\nStudent ID: ${currentUser.studentId || 'Pending'}\nNotes / Ministry Justification: ${reason || 'Targeted modular study / elective advancement request.'}`,
      status: 'Open',
      priority: 'Medium',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      responses: [
        {
          sender: "Office of the Academic Registrar",
          message: `Module-specific enrolment application logged under reference #${ticketNumber}. The department dean will review modular prerequisite access.`,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          isStaff: true
        }
      ]
    };

    setSupportTickets(prev => [newTicket, ...prev]);

    return {
      success: true,
      message: `Module access request for "${moduleTitle}" in ${course.code} has been submitted (Ref: ${ticketNumber}).`,
      ticketNumber
    };
  };

  // Super Admin CMS CRUD: User Accounts
  const createUser = (userData: Omit<User, 'id'>): User => {
    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}`
    };
    setAllUsers(prev => [newUser, ...prev]);
    return newUser;
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setAllUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    if (currentUser.id === id) {
      setCurrentUser(prev => ({ ...prev, ...updates }));
    }
  };

  const deleteUser = (id: string) => {
    setAllUsers(prev => prev.filter(u => u.id !== id));
  };

  const updateUserRole = (id: string, role: Role) => {
    setAllUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
    if (currentUser.id === id) {
      setCurrentUser(prev => ({ ...prev, role }));
    }
  };

  // ==========================================
  // GLOBAL ALUMNI MANAGEMENT SYSTEM (2017–2026)
  // ==========================================
  const addAlumni = (alumniData: Omit<Alumni, 'id' | 'created_at' | 'updated_at'>): Alumni => {
    const newId = `alm-${Date.now()}`;
    const newAlumniId = alumniData.alumni_id || `BIBU-ALM-${alumniData.graduation_year}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord: Alumni = {
      ...alumniData,
      id: newId,
      alumni_id: newAlumniId,
      verification_status: alumniData.verification_status || 'Verified Alumni',
      privacy_status: alumniData.privacy_status || 'Public Directory',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setAlumniList((prev) => [newRecord, ...prev]);
    return newRecord;
  };

  const updateAlumni = (id: string, updates: Partial<Alumni>) => {
    setAlumniList((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
              updated_at: new Date().toISOString(),
            }
          : item
      )
    );
  };

  const deleteAlumni = (id: string) => {
    setAlumniList((prev) => prev.filter((item) => item.id !== id));
  };

  const importAlumniRecords = (records: Partial<Alumni>[]): { successCount: number; errors: string[] } => {
    let successCount = 0;
    const errors: string[] = [];

    const newEntries: Alumni[] = [];

    records.forEach((rec, idx) => {
      if (!rec.first_name || !rec.last_name || !rec.country || !rec.graduation_year || !rec.program_name) {
        errors.push(`Row ${idx + 1}: Missing required fields (first_name, last_name, country, graduation_year, or program_name).`);
        return;
      }

      const gradYear = Number(rec.graduation_year);
      if (isNaN(gradYear) || gradYear < 2000 || gradYear > 2030) {
        errors.push(`Row ${idx + 1}: Invalid graduation year (${rec.graduation_year}).`);
        return;
      }

      const id = `alm-imp-${Date.now()}-${idx}`;
      const fullName = rec.full_name || `${rec.first_name} ${rec.middle_name ? rec.middle_name + ' ' : ''}${rec.last_name}`;
      const alumniId = rec.alumni_id || `BIBU-ALM-${gradYear}-${Math.floor(1000 + Math.random() * 9000)}`;

      const newRecord: Alumni = {
        id,
        alumni_id: alumniId,
        student_id: rec.student_id || `STD-${gradYear}-${Math.floor(1000 + Math.random() * 9000)}`,
        certificate_number: rec.certificate_number || `BIBU-CRT-${gradYear}-${Math.floor(10000 + Math.random() * 90000)}`,
        first_name: rec.first_name,
        middle_name: rec.middle_name || '',
        last_name: rec.last_name,
        full_name: fullName,
        country: rec.country,
        country_code: rec.country_code || 'XX',
        city: rec.city || 'Global',
        email: rec.email || `${rec.first_name.toLowerCase()}.${rec.last_name.toLowerCase()}@alumni.bibu.university`,
        phone: rec.phone || '',
        graduation_year: gradYear,
        graduation_date: rec.graduation_date || `${gradYear}-06-30`,
        program_id: rec.program_id || 'prog-imported',
        program_name: rec.program_name,
        qualification_level: rec.qualification_level || 'Bachelor',
        campus: rec.campus || 'Online Global Center',
        study_mode: rec.study_mode || 'Distance Learning',
        current_position: rec.current_position || 'Ministerial Leader',
        organization: rec.organization || 'Independent Ministry',
        profession: rec.profession || 'Pastoral Ministry & Theological Leadership',
        ministry: rec.ministry || 'Apostolic Ministry',
        biography: rec.biography || `Alumni graduate of BIBU class of ${gradYear}.`,
        achievements: rec.achievements || ['BIBU Academic Credential'],
        verification_status: rec.verification_status || 'Verified Alumni',
        privacy_status: rec.privacy_status || 'Public Directory',
        is_demo: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      newEntries.push(newRecord);
      successCount++;
    });

    if (newEntries.length > 0) {
      setAlumniList((prev) => [...newEntries, ...prev]);
    }

    return { successCount, errors };
  };

  const verifyAlumniGraduate = (query: { alumniId?: string; certificateNumber?: string; studentId?: string }): Alumni | undefined => {
    const almId = query.alumniId?.trim().toUpperCase();
    const certNum = query.certificateNumber?.trim().toUpperCase();
    const stdId = query.studentId?.trim().toUpperCase();

    return alumniList.find((alum) => {
      if (almId && alum.alumni_id.toUpperCase() === almId) return true;
      if (certNum && alum.certificate_number && alum.certificate_number.toUpperCase() === certNum) return true;
      if (stdId && alum.student_id && alum.student_id.toUpperCase() === stdId) return true;
      return false;
    });
  };

  const graduateStudentToAlumni = (studentId: string, graduationData?: Partial<Alumni>): Alumni => {
    const studentUser = allUsers.find((u) => u.studentId === studentId || u.id === studentId);
    const gradYear = graduationData?.graduation_year || new Date().getFullYear();
    const nameParts = (studentUser?.name || 'Graduating Student').split(' ');
    const firstName = nameParts[0] || 'Graduate';
    const lastName = nameParts.slice(1).join(' ') || 'BIBU';

    const newAlumni = addAlumni({
      alumni_id: `BIBU-ALM-${gradYear}-${Math.floor(1000 + Math.random() * 9000)}`,
      student_id: studentUser?.studentId || studentId,
      certificate_number: `BIBU-CRT-${gradYear}-${Math.floor(10000 + Math.random() * 90000)}`,
      first_name: firstName,
      last_name: lastName,
      full_name: studentUser?.name || `${firstName} ${lastName}`,
      country: studentUser?.country || graduationData?.country || 'Kenya',
      country_code: graduationData?.country_code || 'KE',
      city: graduationData?.city || 'Nairobi',
      email: studentUser?.email || `${firstName.toLowerCase()}@alumni.bibu.university`,
      phone: studentUser?.phone || '',
      graduation_year: gradYear,
      graduation_date: `${gradYear}-08-15`,
      program_id: studentUser?.programId || graduationData?.program_id || 'prog-bth',
      program_name: studentUser?.programName || graduationData?.program_name || 'Bachelor of Theology (B.Th)',
      qualification_level: graduationData?.qualification_level || 'Bachelor',
      campus: 'Online Global Center',
      study_mode: 'Distance Learning',
      current_position: graduationData?.current_position || 'Senior Pastor & BIBU Graduate',
      organization: graduationData?.organization || 'Christ Fellowship Worldwide',
      profession: 'Pastoral Ministry & Theological Leadership',
      ministry: studentUser?.ministryAffiliation || graduationData?.ministry || 'Pastoral Ministry',
      biography: `Honored graduate of Breakthrough International Bible University, Class of ${gradYear}.`,
      achievements: ['Biblical Studies Graduate Award', 'Ordained Ministry Credential'],
      verification_status: 'Verified Alumni',
      privacy_status: 'Public Directory',
      is_demo: false,
      ...graduationData,
    });

    // Update user role if matched
    if (studentUser) {
      updateUserRole(studentUser.id, 'alumni');
    }

    return newAlumni;
  };

  // ==========================================
  // GLOBAL EXAMINATION CENTRE & STUDENT REGISTRATION METHODS
  // ==========================================

  const logAuditEvent = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const newLog: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const generateStudentNumber = (countryCode: string = 'KE', cityOrCounty: string = 'NAI'): string => {
    const year = new Date().getFullYear();
    const cCode = (countryCode || 'KE').toUpperCase().slice(0, 3);
    const locCode = (cityOrCounty || 'GEN').replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 3) || 'GEN';
    const seq = String(centreStudents.length + 1).padStart(4, '0');
    return `BIBU/${year}/${cCode}/${locCode}/${seq}`;
  };

  const generateCentreCode = (countryCode: string = 'KE', cityOrCounty: string = 'NAI'): string => {
    const cCode = (countryCode || 'KE').toUpperCase().slice(0, 2);
    const locCode = (cityOrCounty || 'CTR').replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 3);
    const countForLoc = examinationCentres.filter(c => c.countryCode === cCode).length + 1;
    const num = String(countForLoc).padStart(3, '0');
    return `BIBU-${cCode}-${num}-${locCode}`;
  };

  const checkDuplicateStudent = (data: {
    nationalIdOrPassport?: string;
    email?: string;
    phone?: string;
    studentNumber?: string;
    excludeId?: string;
  }): CentreStudent | undefined => {
    return centreStudents.find(s => {
      if (data.excludeId && s.id === data.excludeId) return false;
      if (data.nationalIdOrPassport && s.nationalIdOrPassport && s.nationalIdOrPassport.trim().toLowerCase() === data.nationalIdOrPassport.trim().toLowerCase()) return true;
      if (data.email && s.email && s.email.trim().toLowerCase() === data.email.trim().toLowerCase()) return true;
      if (data.phone && s.phone && s.phone.replace(/[^0-9]/g, '') === data.phone.replace(/[^0-9]/g, '')) return true;
      if (data.studentNumber && s.studentNumber && s.studentNumber.trim().toUpperCase() === data.studentNumber.trim().toUpperCase()) return true;
      return false;
    });
  };

  const addExaminationCentre = (centreData: Omit<ExaminationCentre, 'id' | 'centreCode' | 'enrolledStudentsCount' | 'registeredCandidatesCount' | 'availableSeats'>): ExaminationCentre => {
    const autoCode = generateCentreCode(centreData.countryCode, centreData.cityOrTown || centreData.countyOrState || 'CTR');
    const newCentre: ExaminationCentre = {
      id: `ctr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      centreCode: autoCode,
      enrolledStudentsCount: 0,
      registeredCandidatesCount: 0,
      availableSeats: centreData.capacity,
      ...centreData,
    };

    setExaminationCentres(prev => [newCentre, ...prev]);

    logAuditEvent({
      userName: currentUser.name,
      userEmail: currentUser.email,
      userRole: currentUser.role,
      action: 'CENTRE_CREATED',
      affectedEntity: `Centre ${newCentre.centreName} (${newCentre.centreCode})`,
      affectedId: newCentre.id,
      ipAddress: '192.168.1.1',
      details: `Created new examination centre: ${newCentre.centreName} (${newCentre.centreCode}) in ${newCentre.countryName}, ${newCentre.countyOrState || newCentre.cityOrTown}.`,
    });

    return newCentre;
  };

  const updateExaminationCentre = (id: string, updates: Partial<ExaminationCentre>) => {
    setExaminationCentres(prev => prev.map(c => {
      if (c.id === id) {
        const updated = { ...c, ...updates };
        if (updates.capacity !== undefined) {
          updated.availableSeats = Math.max(0, updates.capacity - updated.registeredCandidatesCount);
        }
        return updated;
      }
      return c;
    }));

    logAuditEvent({
      userName: currentUser.name,
      userEmail: currentUser.email,
      userRole: currentUser.role,
      action: 'CENTRE_UPDATED',
      affectedEntity: `Examination Centre ID ${id}`,
      affectedId: id,
      ipAddress: '192.168.1.1',
      details: `Updated examination centre details for ID ${id}.`,
    });
  };

  const deleteExaminationCentre = (id: string) => {
    const target = examinationCentres.find(c => c.id === id);
    setExaminationCentres(prev => prev.filter(c => c.id !== id));

    if (target) {
      logAuditEvent({
        userName: currentUser.name,
        userEmail: currentUser.email,
        userRole: currentUser.role,
        action: 'CENTRE_STATUS_CHANGED',
        affectedEntity: `Centre ${target.centreName} (${target.centreCode})`,
        affectedId: id,
        ipAddress: '192.168.1.1',
        details: `Deleted examination centre: ${target.centreName} (${target.centreCode}).`,
      });
    }
  };

  const registerStudentWithCentre = (studentData: Partial<CentreStudent>): { student: CentreStudent; studentNumber: string } => {
    const targetCentre = examinationCentres.find(c => c.id === studentData.examinationCentreId);
    const countryCode = targetCentre?.countryCode || studentData.countryCode || 'KE';
    const cityOrCounty = targetCentre?.countyOrState || targetCentre?.cityOrTown || studentData.countyOrState || 'NAI';
    const autoStudentNum = studentData.studentNumber || generateStudentNumber(countryCode, cityOrCounty);

    const nowIso = new Date().toISOString();
    const newStudent: CentreStudent = {
      id: `stud-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      studentNumber: autoStudentNum,
      applicationNumber: studentData.applicationNumber || `APP-${new Date().getFullYear()}-${countryCode}-${String(centreStudents.length + 1).padStart(4, '0')}`,
      firstName: studentData.firstName || 'Student',
      lastName: studentData.lastName || 'Candidate',
      middleName: studentData.middleName || '',
      fullName: studentData.fullName || `${studentData.firstName || ''} ${studentData.lastName || ''}`.trim(),
      email: studentData.email || `student.${Date.now()}@bibu-edu.org`,
      phone: studentData.phone || '+254700000000',
      nationalIdOrPassport: studentData.nationalIdOrPassport || '',
      dateOfBirth: studentData.dateOfBirth || '1995-01-01',
      gender: studentData.gender || 'Male',
      nationality: studentData.nationality || 'Kenyan',
      residentialAddress: studentData.residentialAddress || 'Nairobi, Kenya',
      continent: studentData.continent || targetCentre?.continent || 'AFRICA',
      country: studentData.country || targetCentre?.countryName || 'Kenya',
      countryCode: countryCode,
      countyOrState: studentData.countyOrState || targetCentre?.countyOrState || 'Nairobi',
      countyCode: targetCentre?.countyCode || studentData.countyCode || 47,
      cityOrTown: studentData.cityOrTown || targetCentre?.cityOrTown || 'Nairobi',
      examinationCentreId: targetCentre?.id || studentData.examinationCentreId || '',
      examinationCentreCode: targetCentre?.centreCode || studentData.examinationCentreCode || '',
      examinationCentreName: targetCentre?.centreName || studentData.examinationCentreName || '',
      schoolId: studentData.schoolId || 'sch-theology',
      schoolName: studentData.schoolName || 'School of Theological Studies',
      programId: studentData.programId || 'prog-bth',
      programName: studentData.programName || 'Bachelor of Theology (B.Th)',
      academicLevel: studentData.academicLevel || 'Bachelor',
      modeOfStudy: studentData.modeOfStudy || 'Digital Online & Centre-Based',
      intake: studentData.intake || 'September 2026',
      academicYear: studentData.academicYear || '2026/2027',
      studyDurationMonths: studentData.studyDurationMonths || 36,
      admissionDate: studentData.admissionDate || nowIso.split('T')[0],
      registrationDate: studentData.registrationDate || nowIso.split('T')[0],
      previousInstitution: studentData.previousInstitution || 'Secondary School / Bible College',
      highestQualification: studentData.highestQualification || 'Diploma',
      qualificationGrade: studentData.qualificationGrade || 'Credit',
      yearCompleted: studentData.yearCompleted || 2022,
      admissionStatus: studentData.admissionStatus || 'Admitted',
      studentStatus: 'Active',
      feeStatus: studentData.feeStatus || 'Fully Paid',
      courseworkStatus: 'In Good Standing',
      examinationEligibility: 'Eligible & Cleared',
      currentExamSeatNumber: targetCentre ? `SEAT-${targetCentre.centreCode.slice(-3)}-${String((targetCentre.registeredCandidatesCount || 0) + 1).padStart(3, '0')}` : undefined,
      currentExamRoom: targetCentre?.rooms?.[0]?.roomName || 'Main Examination Hall',
      currentGpa: 3.8,
      creditsEarned: 0,
      totalRequiredCredits: 120,
      documents: studentData.documents || [
        {
          id: `doc-${Date.now()}-1`,
          documentType: 'National ID',
          fileName: 'national_id_card.pdf',
          fileSize: '1.2 MB',
          uploadDate: nowIso,
          verificationStatus: 'Verified',
        },
        {
          id: `doc-${Date.now()}-2`,
          documentType: 'KCSE Certificate',
          fileName: 'academic_certificate.pdf',
          fileSize: '2.4 MB',
          uploadDate: nowIso,
          verificationStatus: 'Verified',
        }
      ],
      centreTransferHistory: [],
      createdAt: nowIso,
      updatedAt: nowIso,
      ...studentData,
    };

    setCentreStudents(prev => [newStudent, ...prev]);

    // Update centre counts if centre assigned
    if (targetCentre) {
      setExaminationCentres(prev => prev.map(c => {
        if (c.id === targetCentre.id) {
          const newRegistered = (c.registeredCandidatesCount || 0) + 1;
          const newEnrolled = (c.enrolledStudentsCount || 0) + 1;
          return {
            ...c,
            registeredCandidatesCount: newRegistered,
            enrolledStudentsCount: newEnrolled,
            availableSeats: Math.max(0, c.capacity - newRegistered),
          };
        }
        return c;
      }));
    }

    logAuditEvent({
      userName: currentUser.name,
      userEmail: currentUser.email,
      userRole: currentUser.role,
      action: 'STUDENT_ADMISSION_CREATED',
      affectedEntity: `Student ${newStudent.fullName} (${newStudent.studentNumber})`,
      affectedId: newStudent.id,
      ipAddress: '192.168.1.1',
      details: `Admitted and registered student ${newStudent.fullName} (${newStudent.studentNumber}) allocated to centre ${newStudent.examinationCentreName} (${newStudent.examinationCentreCode}).`,
    });

    return { student: newStudent, studentNumber: autoStudentNum };
  };

  const updateCentreStudent = (id: string, updates: Partial<CentreStudent>) => {
    setCentreStudents(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, ...updates, updatedAt: new Date().toISOString() };
      }
      return s;
    }));

    logAuditEvent({
      userName: currentUser.name,
      userEmail: currentUser.email,
      userRole: currentUser.role,
      action: 'STUDENT_CENTRE_ASSIGNED',
      affectedEntity: `Student ID ${id}`,
      affectedId: id,
      ipAddress: '192.168.1.1',
      details: `Updated student record for ID ${id}.`,
    });
  };

  const deleteCentreStudent = (id: string) => {
    const target = centreStudents.find(s => s.id === id);
    setCentreStudents(prev => prev.filter(s => s.id !== id));

    if (target) {
      logAuditEvent({
        userName: currentUser.name,
        userEmail: currentUser.email,
        userRole: currentUser.role,
        action: 'STUDENT_CENTRE_ASSIGNED',
        affectedEntity: `Student ${target.fullName} (${target.studentNumber})`,
        affectedId: id,
        ipAddress: '192.168.1.1',
        details: `Deleted student record ${target.fullName} (${target.studentNumber}).`,
      });
    }
  };

  const transferStudentCentre = (studentId: string, toCentreId: string, reason: string, adminName?: string): { success: boolean; message: string } => {
    const student = centreStudents.find(s => s.id === studentId);
    if (!student) {
      return { success: false, message: 'Student record not found.' };
    }

    const targetCentre = examinationCentres.find(c => c.id === toCentreId);
    if (!targetCentre) {
      return { success: false, message: 'Target examination centre not found.' };
    }

    if (student.examinationCentreId === toCentreId) {
      return { success: false, message: 'Student is already assigned to this examination centre.' };
    }

    if (targetCentre.availableSeats <= 0 && targetCentre.capacity > 0) {
      return { success: false, message: `Target centre ${targetCentre.centreName} has reached full candidate capacity (${targetCentre.capacity}).` };
    }

    const previousCentreId = student.examinationCentreId;
    const nowIso = new Date().toISOString();

    const newTransferAudit: StudentTransferAudit = {
      id: `trf-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      transferDate: nowIso,
      fromCentreId: student.examinationCentreId,
      fromCentreCode: student.examinationCentreCode,
      fromCentreName: student.examinationCentreName,
      fromCountry: student.country,
      fromCounty: student.countyOrState,
      toCentreId: targetCentre.id,
      toCentreCode: targetCentre.centreCode,
      toCentreName: targetCentre.centreName,
      toCountry: targetCentre.countryName,
      toCounty: targetCentre.countyOrState,
      authorizedByAdminName: adminName || currentUser.name || 'Academic Registrar',
      authorizedByAdminRole: currentUser.role,
      reason: reason || 'Student relocation / Centre transfer request',
      approvalStatus: 'Approved',
      studentNotificationSent: true,
      notificationTimestamp: nowIso,
    };

    setCentreStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          examinationCentreId: targetCentre.id,
          examinationCentreCode: targetCentre.centreCode,
          examinationCentreName: targetCentre.centreName,
          currentExamSeatNumber: `SEAT-${targetCentre.centreCode.slice(-3)}-${String((targetCentre.registeredCandidatesCount || 0) + 1).padStart(3, '0')}`,
          currentExamRoom: targetCentre.rooms?.[0]?.roomName || 'Main Examination Hall',
          centreTransferHistory: [newTransferAudit, ...(s.centreTransferHistory || [])],
          updatedAt: nowIso,
        };
      }
      return s;
    }));

    // Update previous centre and new centre counts
    setExaminationCentres(prev => prev.map(c => {
      if (c.id === previousCentreId) {
        const newCount = Math.max(0, (c.registeredCandidatesCount || 1) - 1);
        return {
          ...c,
          registeredCandidatesCount: newCount,
          availableSeats: Math.max(0, c.capacity - newCount),
        };
      }
      if (c.id === targetCentre.id) {
        const newCount = (c.registeredCandidatesCount || 0) + 1;
        return {
          ...c,
          registeredCandidatesCount: newCount,
          availableSeats: Math.max(0, c.capacity - newCount),
        };
      }
      return c;
    }));

    logAuditEvent({
      userName: currentUser.name,
      userEmail: currentUser.email,
      userRole: currentUser.role,
      action: 'STUDENT_CENTRE_TRANSFERRED',
      affectedEntity: `Student ${student.fullName} (${student.studentNumber})`,
      affectedId: studentId,
      previousValue: `${student.examinationCentreName} (${student.examinationCentreCode})`,
      newValue: `${targetCentre.centreName} (${targetCentre.centreCode})`,
      ipAddress: '192.168.1.1',
      details: `Transferred student ${student.fullName} (${student.studentNumber}) from ${student.examinationCentreName} to ${targetCentre.centreName} (${targetCentre.centreCode}). Reason: ${reason}.`,
    });

    return { success: true, message: `Successfully transferred student to ${targetCentre.centreName} (${targetCentre.centreCode}).` };
  };

  const verifyStudentDocument = (studentId: string, documentId: string, status: 'Verified' | 'Rejected', verifiedBy: string, remarks?: string) => {
    const nowIso = new Date().toISOString();
    setCentreStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const updatedDocs = (s.documents || []).map(d => {
          if (d.id === documentId) {
            return {
              ...d,
              verificationStatus: status,
              verifiedBy: verifiedBy || currentUser.name,
              verificationDate: nowIso,
              remarks: status === 'Rejected' ? remarks : d.remarks,
            };
          }
          return d;
        });
        return { ...s, documents: updatedDocs, updatedAt: nowIso };
      }
      return s;
    }));

    logAuditEvent({
      userName: currentUser.name,
      userEmail: currentUser.email,
      userRole: currentUser.role,
      action: status === 'Verified' ? 'DOCUMENT_VERIFIED' : 'DOCUMENT_REJECTED',
      affectedEntity: `Student Document ${documentId}`,
      affectedId: studentId,
      ipAddress: '192.168.1.1',
      details: `Document ${documentId} for student ${studentId} marked as ${status} by ${verifiedBy}.`,
    });
  };

  const recordExamAttendance = (record: Partial<CentreExamAttendanceRecord>) => {
    const nowIso = new Date().toISOString();
    const newRecord: CentreExamAttendanceRecord = {
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      examSessionId: record.examSessionId || 'ses-001',
      examinationId: record.examinationId || 'crs-herm-301',
      courseCode: record.courseCode || 'HERM-301',
      courseTitle: record.courseTitle || 'Biblical Hermeneutics Final Exam',
      centreId: record.centreId || '',
      centreCode: record.centreCode || '',
      studentId: record.studentId || '',
      studentNumber: record.studentNumber || '',
      studentName: record.studentName || '',
      nationalIdOrPassport: record.nationalIdOrPassport || '',
      seatNumber: record.seatNumber || 'A-01',
      roomNumber: record.roomNumber || 'Room 101',
      attendanceStatus: record.attendanceStatus || 'Present',
      idVerified: record.idVerified ?? true,
      examCardPresented: record.examCardPresented ?? true,
      timeIn: record.timeIn || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timeOut: record.timeOut,
      invigilatorName: record.invigilatorName || currentUser.name,
      studentSignatureRecorded: record.studentSignatureRecorded ?? true,
      remarks: record.remarks,
      updatedAt: nowIso,
      ...record,
    };

    setExamAttendanceRecords(prev => [newRecord, ...prev]);

    logAuditEvent({
      userName: currentUser.name,
      userEmail: currentUser.email,
      userRole: currentUser.role,
      action: 'ATTENDANCE_RECORDED',
      affectedEntity: `Exam Attendance ${newRecord.studentName}`,
      affectedId: newRecord.id,
      ipAddress: '192.168.1.1',
      details: `Recorded exam attendance (${newRecord.attendanceStatus}) for ${newRecord.studentName} at centre ${newRecord.centreCode}.`,
    });
  };

  const updateAttendanceStatus = (attendanceId: string, status: AttendanceStatus, remarks?: string, timeOut?: string) => {
    setExamAttendanceRecords(prev => prev.map(a => {
      if (a.id === attendanceId) {
        return {
          ...a,
          attendanceStatus: status,
          remarks: remarks || a.remarks,
          timeOut: timeOut || a.timeOut,
          updatedAt: new Date().toISOString(),
        };
      }
      return a;
    }));
  };

  const addKenyaCounty = (county: Omit<KenyaCounty, 'id'>): KenyaCounty => {
    const newCounty: KenyaCounty = {
      id: `county-${county.countyCode}`,
      ...county,
    };
    setKenyaCounties(prev => [...prev, newCounty]);
    return newCounty;
  };

  const updateKenyaCounty = (id: string, updates: Partial<KenyaCounty>) => {
    setKenyaCounties(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const addGlobalCountry = (country: Omit<GlobalCountry, 'id'>): GlobalCountry => {
    const newCountry: GlobalCountry = {
      id: `country-${country.countryCode.toLowerCase()}`,
      ...country,
    };
    setGlobalCountries(prev => [...prev, newCountry]);
    return newCountry;
  };

  const updateGlobalCountry = (id: string, updates: Partial<GlobalCountry>) => {
    setGlobalCountries(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  // Reset / Restore default mock data
  const resetToDefaultData = () => {
    localStorage.clear();
    setAllUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setUniversityInfo(UNIVERSITY_INFO);
    setSchools(INITIAL_SCHOOLS);
    setPrograms(INITIAL_PROGRAMS);
    setCourses(INITIAL_COURSES);
    setModules(INITIAL_MODULES);
    setAssignments(INITIAL_ASSIGNMENTS);
    setExaminations(INITIAL_EXAMINATIONS);
    setGrades(INITIAL_GRADES);
    setCertificates(INITIAL_CERTIFICATES);
    setLibraryResources(INITIAL_LIBRARY_RESOURCES);
    setApplications(INITIAL_APPLICATIONS);
    setRplApplications(INITIAL_RPL_APPLICATIONS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setFinancials(INITIAL_FINANCIALS);
    setInvoices(INITIAL_INVOICES);
    setSupportTickets(INITIAL_SUPPORT_TICKETS);
    setCompletedLessonIds(['les-herm-101']);
    setAlumniList(INITIAL_ALUMNI_DATABASE);
    setKenyaCounties(KENYA_47_COUNTIES);
    setGlobalCountries(GLOBAL_COUNTRIES);
    setExaminationCentres(INITIAL_EXAMINATION_CENTRES);
    setCentreStudents(INITIAL_CENTRE_STUDENTS);
    setExamSessions(INITIAL_EXAMINATION_SESSIONS);
    setExamAttendanceRecords(INITIAL_EXAM_ATTENDANCES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setMediaChannels(INITIAL_MEDIA_CHANNELS);
    setMediaVideos(INITIAL_MEDIA_VIDEOS);
    setMediaPlaylists(INITIAL_MEDIA_PLAYLISTS);
    setTvPrograms(INITIAL_TV_PROGRAMS);
    setRadioPrograms(INITIAL_RADIO_SCHEDULE);
    setRadioSettings(INITIAL_RADIO_SETTINGS);
    setYoutubeSettings(INITIAL_YOUTUBE_SETTINGS);
    setMediaPresenters(INITIAL_MEDIA_PRESENTERS);
    setStudentMediaProgress(INITIAL_STUDENT_MEDIA_PROGRESS);
    setMediaAnalytics(INITIAL_MEDIA_ANALYTICS);
  };

  const verifyCertificateCode = (code: string): Certificate | undefined => {
    const clean = code.trim().toUpperCase();
    return certificates.find(c => 
      c.certificateNumber.toUpperCase() === clean || 
      c.verificationCode.toUpperCase() === clean
    );
  };

  // Media Operations
  const addMediaVideo = (videoData: Omit<MediaVideo, 'id' | 'viewsCount' | 'likesCount'>): MediaVideo => {
    const newVideo: MediaVideo = {
      ...videoData,
      id: `vid-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      viewsCount: 0,
      likesCount: 0
    };
    setMediaVideos(prev => [newVideo, ...prev]);
    return newVideo;
  };

  const updateMediaVideo = (id: string, updates: Partial<MediaVideo>) => {
    setMediaVideos(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
  };

  const deleteMediaVideo = (id: string) => {
    setMediaVideos(prev => prev.filter(v => v.id !== id));
  };

  const reorderMediaVideos = (sourceId: string, direction: 'up' | 'down') => {
    setMediaVideos(prev => {
      const idx = prev.findIndex(v => v.id === sourceId);
      if (idx === -1) return prev;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const clone = [...prev];
      const temp = clone[idx];
      clone[idx] = clone[targetIdx];
      clone[targetIdx] = temp;
      return clone;
    });
  };

  const addTVProgram = (programData: Omit<TVProgram, 'id'>): TVProgram => {
    const newProg: TVProgram = {
      ...programData,
      id: `tv-prog-${Date.now()}`
    };
    setTvPrograms(prev => [...prev, newProg]);
    return newProg;
  };

  const updateTVProgram = (id: string, updates: Partial<TVProgram>) => {
    setTvPrograms(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteTVProgram = (id: string) => {
    setTvPrograms(prev => prev.filter(p => p.id !== id));
  };

  const addRadioProgram = (programData: Omit<RadioProgram, 'id'>): RadioProgram => {
    const newProg: RadioProgram = {
      ...programData,
      id: `radio-prog-${Date.now()}`
    };
    setRadioPrograms(prev => [...prev, newProg]);
    return newProg;
  };

  const updateRadioProgram = (id: string, updates: Partial<RadioProgram>) => {
    setRadioPrograms(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteRadioProgram = (id: string) => {
    setRadioPrograms(prev => prev.filter(p => p.id !== id));
  };

  const updateRadioSettings = (settings: Partial<RadioSettings>) => {
    setRadioSettings(prev => ({ ...prev, ...settings }));
  };

  const updateYouTubeSettings = (settings: Partial<YouTubeSettings>) => {
    setYoutubeSettings(prev => ({ ...prev, ...settings }));
  };

  const addMediaPresenter = (presenterData: Omit<MediaPresenter, 'id'>): MediaPresenter => {
    const newPres: MediaPresenter = {
      ...presenterData,
      id: `pres-${Date.now()}`
    };
    setMediaPresenters(prev => [...prev, newPres]);
    return newPres;
  };

  const updateMediaPresenter = (id: string, updates: Partial<MediaPresenter>) => {
    setMediaPresenters(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteMediaPresenter = (id: string) => {
    setMediaPresenters(prev => prev.filter(p => p.id !== id));
  };

  const toggleRadioPlay = () => {
    setIsRadioPlaying(prev => !prev);
  };

  const toggleStudentBookmarkVideo = (videoId: string) => {
    if (!currentUser) return;
    setStudentMediaProgress(prev => {
      const existing = prev.find(p => p.studentId === currentUser.id && p.videoId === videoId);
      if (existing) {
        return prev.map(p => p.studentId === currentUser.id && p.videoId === videoId ? { ...p, isBookmarked: !p.isBookmarked } : p);
      } else {
        return [...prev, {
          studentId: currentUser.id,
          videoId,
          watchedSeconds: 0,
          totalSeconds: 0,
          completed: false,
          lastWatchedAt: new Date().toISOString(),
          isBookmarked: true,
          isFavorite: false
        }];
      }
    });
  };

  const toggleStudentFavoriteVideo = (videoId: string) => {
    if (!currentUser) return;
    setStudentMediaProgress(prev => {
      const existing = prev.find(p => p.studentId === currentUser.id && p.videoId === videoId);
      if (existing) {
        return prev.map(p => p.studentId === currentUser.id && p.videoId === videoId ? { ...p, isFavorite: !p.isFavorite } : p);
      } else {
        return [...prev, {
          studentId: currentUser.id,
          videoId,
          watchedSeconds: 0,
          totalSeconds: 0,
          completed: false,
          lastWatchedAt: new Date().toISOString(),
          isBookmarked: false,
          isFavorite: true
        }];
      }
    });
  };

  const updateStudentVideoProgress = (videoId: string, watchedSeconds: number, totalSeconds: number) => {
    if (!currentUser) return;
    const completed = totalSeconds > 0 && (watchedSeconds / totalSeconds >= 0.9);
    setStudentMediaProgress(prev => {
      const existing = prev.find(p => p.studentId === currentUser.id && p.videoId === videoId);
      if (existing) {
        return prev.map(p => p.studentId === currentUser.id && p.videoId === videoId ? {
          ...p,
          watchedSeconds: Math.max(p.watchedSeconds, watchedSeconds),
          totalSeconds: totalSeconds || p.totalSeconds,
          completed: completed || p.completed,
          lastWatchedAt: new Date().toISOString()
        } : p);
      } else {
        return [...prev, {
          studentId: currentUser.id,
          videoId,
          watchedSeconds,
          totalSeconds,
          completed,
          lastWatchedAt: new Date().toISOString(),
          isBookmarked: false,
          isFavorite: false
        }];
      }
    });
  };

  const recordVideoView = (videoId: string) => {
    setMediaVideos(prev => prev.map(v => v.id === videoId ? { ...v, viewsCount: v.viewsCount + 1 } : v));
  };

  // ==========================================
  // GRADUATION, ALUMNI & BOOKLET MANAGEMENT
  // ==========================================
  const addGraduationCeremony = (ceremonyData: Omit<GraduationCeremony, 'id' | 'createdAt' | 'updatedAt'>): GraduationCeremony => {
    const newCeremony: GraduationCeremony = {
      ...ceremonyData,
      id: `ceremony-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setGraduationCeremonies(prev => [newCeremony, ...prev]);
    logGraduationAudit({
      ceremonyId: newCeremony.id,
      action: 'Create Ceremony',
      performedBy: currentUser.name,
      role: currentUser.role,
      details: `Created ceremony: ${newCeremony.graduationNumber} (${newCeremony.graduationYear}) at ${newCeremony.venue}`
    });
    return newCeremony;
  };

  const updateGraduationCeremony = (id: string, updates: Partial<GraduationCeremony>) => {
    setGraduationCeremonies(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c))
    );
    logGraduationAudit({
      ceremonyId: id,
      action: 'Update Ceremony',
      performedBy: currentUser.name,
      role: currentUser.role,
      details: `Updated ceremony #${id}`
    });
  };

  const deleteGraduationCeremony = (id: string) => {
    setGraduationCeremonies(prev => prev.filter(c => c.id !== id));
    logGraduationAudit({
      ceremonyId: id,
      action: 'Delete Ceremony',
      performedBy: currentUser.name,
      role: currentUser.role,
      details: `Deleted ceremony #${id}`
    });
  };

  const addGraduationCandidate = (candidateData: Omit<GraduationCandidate, 'id' | 'createdAt' | 'updatedAt'>): GraduationCandidate => {
    const nextBookletNum = `BK-${String(graduationCandidates.length + 1).padStart(3, '0')}`;
    const newCandidate: GraduationCandidate = {
      ...candidateData,
      id: `cand-${Date.now()}`,
      bookletNumber: candidateData.bookletNumber || nextBookletNum,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setGraduationCandidates(prev => [newCandidate, ...prev]);
    logGraduationAudit({
      candidateId: newCandidate.id,
      action: 'Register Candidate',
      performedBy: currentUser.name,
      role: currentUser.role,
      details: `Registered candidate: ${newCandidate.fullName} (${newCandidate.studentId}) for ${newCandidate.programName}`
    });
    return newCandidate;
  };

  const updateGraduationCandidate = (id: string, updates: Partial<GraduationCandidate>) => {
    setGraduationCandidates(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c))
    );
  };

  const deleteGraduationCandidate = (id: string) => {
    setGraduationCandidates(prev => prev.filter(c => c.id !== id));
    logGraduationAudit({
      candidateId: id,
      action: 'Remove Candidate',
      performedBy: currentUser.name,
      role: currentUser.role,
      details: `Removed candidate #${id}`
    });
  };

  const updateDepartmentClearance = (
    candidateId: string,
    department: keyof GraduationCandidate['clearances'],
    record: Partial<DepartmentClearanceRecord>
  ) => {
    setGraduationCandidates(prev =>
      prev.map(cand => {
        if (cand.id !== candidateId) return cand;

        const currentDept = cand.clearances[department];
        const updatedDept: DepartmentClearanceRecord = {
          ...currentDept,
          ...record,
          status: record.status || currentDept.status,
          clearedBy: record.clearedBy || currentUser.name,
          clearedDate: record.clearedDate || new Date().toISOString().split('T')[0],
          notes: record.notes !== undefined ? record.notes : currentDept.notes,
        };

        const newClearances = {
          ...cand.clearances,
          [department]: updatedDept
        };

        const deptKeys = Object.keys(newClearances) as (keyof GraduationCandidate['clearances'])[];
        const completedCount = deptKeys.filter(k => newClearances[k].status === 'Completed' || newClearances[k].status === 'Not Required').length;
        const newProgress = Math.round((completedCount / deptKeys.length) * 100);
        const newStatus = newProgress === 100 ? 'Clearance Approved' : cand.status === 'Conferred Graduate' ? 'Conferred Graduate' : 'Eligible Candidate';

        return {
          ...cand,
          clearances: newClearances,
          clearanceProgress: newProgress,
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
      })
    );

    logGraduationAudit({
      candidateId,
      action: 'Update Clearance',
      performedBy: currentUser.name,
      role: currentUser.role,
      details: `Updated ${String(department)} clearance to ${record.status || 'Updated'}`
    });
  };

  const conferCandidateToGraduate = (candidateId: string) => {
    const candidate = graduationCandidates.find(c => c.id === candidateId);
    const gradYear = candidate?.graduationYear || new Date().getFullYear();
    const certNum = `BIBU-CERT-${gradYear}-${Math.floor(1000 + Math.random() * 9000)}`;
    const vrfCode = `VRF-${Math.floor(1000 + Math.random() * 9000)}-${candidate?.awardLevel.toUpperCase().slice(0, 3) || 'DEG'}-AZ`;

    // 1. Update candidate
    const updatedCandidate: GraduationCandidate = {
      ...(candidate || ({} as GraduationCandidate)),
      status: 'Conferred Graduate',
      certificateNumber: certNum,
      updatedAt: new Date().toISOString()
    };

    setGraduationCandidates(prev =>
      prev.map(c => (c.id === candidateId ? updatedCandidate : c))
    );

    // 2. Issue Certificate Record
    const newCertificate: GraduationCertificateRecord = {
      id: `cert-${Date.now()}`,
      certificateNumber: certNum,
      candidateId,
      studentId: candidate?.studentId || 'BIBU-STU-001',
      studentName: candidate?.fullName || 'Graduate',
      degreeTitle: candidate?.programName || 'Degree of Theology',
      schoolName: candidate?.schoolName || 'School of Theology',
      awardLevel: candidate?.awardLevel || 'Bachelor',
      honors: candidate?.academicHonors,
      conferralDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      ceremonyId: candidate?.ceremonyId || 'ceremony-2026-15',
      chancellorName: universityInfo.chancellor,
      viceChancellorName: universityInfo.viceChancellor,
      registrarName: universityInfo.registrar,
      verificationCode: vrfCode,
      status: 'Conferred & Valid',
      qrCodeUrl: `https://bibu.university/verify?code=${vrfCode}`
    };

    setGraduationCertificates(prev => [newCertificate, ...prev]);

    // 3. Automatically add/migrate to permanent Global Alumni Database
    let alumniRecord: Alumni | undefined;
    if (candidate) {
      alumniRecord = graduateStudentToAlumni(candidate.studentId, {
        graduation_year: candidate.graduationYear,
        full_name: candidate.fullName,
        first_name: candidate.firstName,
        last_name: candidate.lastName,
        country: candidate.country,
        city: candidate.city,
        program_name: candidate.programName,
        qualification_level: candidate.awardLevel,
        study_mode: candidate.studyMode,
        ministry: candidate.currentMinistry,
        biography: candidate.biography,
        certificate_number: certNum
      });
    }

    logGraduationAudit({
      candidateId,
      ceremonyId: candidate?.ceremonyId,
      action: 'Confer Degree',
      performedBy: currentUser.name,
      role: currentUser.role,
      details: `Formally conferred degree ${candidate?.programName} to ${candidate?.fullName}. Issued Certificate ${certNum} and registered to Alumni Association.`
    });

    return { candidate: updatedCandidate, certificate: newCertificate, alumni: alumniRecord };
  };

  const generateGraduationBooklet = (ceremonyId: string, overrides?: Partial<GraduationBooklet>): GraduationBooklet => {
    const ceremony = graduationCeremonies.find(c => c.id === ceremonyId) || graduationCeremonies[0];
    const ceremonyCands = graduationCandidates.filter(c => c.ceremonyId === ceremonyId);

    const newBooklet: GraduationBooklet = {
      ...INITIAL_GRADUATION_BOOKLET,
      id: `booklet-${Date.now()}`,
      ceremonyId,
      title: `Official Commemorative Convocation Booklet – ${ceremony?.graduationNumber || 'Annual Congregation'}`,
      academicYear: `${ceremony?.graduationYear || 2026 - 1}/${ceremony?.graduationYear || 2026}`,
      theme: ceremony?.theme || INITIAL_GRADUATION_BOOKLET.theme,
      generatedAt: new Date().toISOString(),
      generatedBy: currentUser.name,
      status: 'Published',
      awards: academicAwards,
      ...overrides
    };

    setGraduationBooklets(prev => [newBooklet, ...prev.filter(b => b.ceremonyId !== ceremonyId)]);
    setActiveGraduationBooklet(newBooklet);

    logGraduationAudit({
      ceremonyId,
      action: 'Generate Booklet',
      performedBy: currentUser.name,
      role: currentUser.role,
      details: `Generated digital convocation booklet for ${ceremony?.graduationNumber} with ${ceremonyCands.length} registered candidates.`
    });

    return newBooklet;
  };

  const updateGraduationBooklet = (bookletId: string, updates: Partial<GraduationBooklet>) => {
    setGraduationBooklets(prev =>
      prev.map(b => (b.id === bookletId ? { ...b, ...updates } : b))
    );
    if (activeGraduationBooklet?.id === bookletId) {
      setActiveGraduationBooklet(prev => (prev ? { ...prev, ...updates } : null));
    }
  };

  const addAcademicAward = (awardData: Omit<AcademicAwardWinner, 'id'>): AcademicAwardWinner => {
    const newAward: AcademicAwardWinner = {
      ...awardData,
      id: `award-${Date.now()}`
    };
    setAcademicAwards(prev => [newAward, ...prev]);
    logGraduationAudit({
      action: 'Add Award',
      performedBy: currentUser.name,
      role: currentUser.role,
      details: `Registered academic award: "${newAward.awardTitle}" to ${newAward.studentName}`
    });
    return newAward;
  };

  const updateAcademicAward = (id: string, updates: Partial<AcademicAwardWinner>) => {
    setAcademicAwards(prev =>
      prev.map(a => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const deleteAcademicAward = (id: string) => {
    setAcademicAwards(prev => prev.filter(a => a.id !== id));
  };

  const issueGraduationCertificateRecord = (candidateId: string): GraduationCertificateRecord => {
    const candidate = graduationCandidates.find(c => c.id === candidateId);
    const gradYear = candidate?.graduationYear || new Date().getFullYear();
    const certNum = `BIBU-CERT-${gradYear}-${Math.floor(1000 + Math.random() * 9000)}`;
    const vrfCode = `VRF-${Math.floor(1000 + Math.random() * 9000)}-AZ`;

    const cert: GraduationCertificateRecord = {
      id: `cert-${Date.now()}`,
      certificateNumber: certNum,
      candidateId,
      studentId: candidate?.studentId || 'BIBU-STU',
      studentName: candidate?.fullName || 'Graduate',
      degreeTitle: candidate?.programName || 'Theology Degree',
      schoolName: candidate?.schoolName || 'School of Theology',
      awardLevel: candidate?.awardLevel || 'Bachelor',
      honors: candidate?.academicHonors,
      conferralDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      ceremonyId: candidate?.ceremonyId || 'ceremony-2026-15',
      chancellorName: universityInfo.chancellor,
      viceChancellorName: universityInfo.viceChancellor,
      registrarName: universityInfo.registrar,
      verificationCode: vrfCode,
      status: 'Conferred & Valid',
      qrCodeUrl: `https://bibu.university/verify?code=${vrfCode}`
    };

    setGraduationCertificates(prev => [cert, ...prev]);
    updateGraduationCandidate(candidateId, { certificateNumber: certNum });
    return cert;
  };

  const updateGraduationCertificateRecord = (id: string, updates: Partial<GraduationCertificateRecord>) => {
    setGraduationCertificates(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const logGraduationAudit = (entry: Omit<GraduationAuditLog, 'id' | 'timestamp'>) => {
    const newEntry: GraduationAuditLog = {
      ...entry,
      id: `audit-grad-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    setGraduationAuditLogs(prev => [newEntry, ...prev]);
  };

  const bulkImportCandidates = (candidatesToImport: Partial<GraduationCandidate>[]): { successCount: number; errors: string[] } => {
    let successCount = 0;
    const errors: string[] = [];
    const newItems: GraduationCandidate[] = [];

    candidatesToImport.forEach((item, index) => {
      if (!item.fullName || !item.studentId || !item.programName) {
        errors.push(`Row #${index + 1}: Missing required fields (fullName, studentId, or programName)`);
        return;
      }

      const nextNum = `BK-${String(graduationCandidates.length + successCount + 1).padStart(3, '0')}`;
      const candidateRecord: GraduationCandidate = {
        id: `cand-${Date.now()}-${index}`,
        studentId: item.studentId,
        admissionNumber: item.admissionNumber || `ADM-2022-${Math.floor(1000 + Math.random() * 9000)}`,
        fullName: item.fullName,
        firstName: item.firstName || item.fullName.split(' ')[0],
        lastName: item.lastName || item.fullName.split(' ').slice(1).join(' '),
        gender: item.gender || 'Male',
        country: item.country || 'Kenya',
        city: item.city || 'Nairobi',
        nationality: item.nationality || 'Kenyan',
        programId: item.programId || 'prog-bth',
        programName: item.programName,
        schoolId: item.schoolId || 'sch-theology',
        schoolName: item.schoolName || 'School of Theology & Biblical Studies',
        awardLevel: item.awardLevel || 'Bachelor',
        studyMode: item.studyMode || 'Online Distance Learning',
        finalGpa: item.finalGpa || 3.75,
        academicHonors: item.academicHonors || 'Cum Laude',
        graduationYear: item.graduationYear || 2026,
        ceremonyId: item.ceremonyId || graduationCeremonies[0]?.id || 'ceremony-2026-15',
        ceremonyNumber: item.ceremonyNumber || '15th Annual Congregation',
        status: item.status || 'Eligible Candidate',
        clearanceProgress: item.clearanceProgress || 71,
        clearances: item.clearances || {
          academic: { status: 'Completed', clearedBy: 'Academic Dean', clearedDate: '2026-09-01' },
          examination: { status: 'Completed', clearedBy: 'Chief Examiner', clearedDate: '2026-09-02' },
          finance: { status: 'Completed', clearedBy: 'University Bursar', clearedDate: '2026-09-03' },
          library: { status: 'Completed', clearedBy: 'Head Librarian', clearedDate: '2026-09-04' },
          studentAffairs: { status: 'Completed', clearedBy: 'Dean of Students', clearedDate: '2026-09-04' },
          registrar: { status: 'Pending' },
          graduationOffice: { status: 'Pending' }
        },
        graduationFeeStatus: item.graduationFeeStatus || 'Paid',
        graduationFeeAmount: item.graduationFeeAmount || 350,
        graduationFeePaid: item.graduationFeePaid || 350,
        bookletNumber: item.bookletNumber || nextNum,
        profilePhoto: item.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        currentMinistry: item.currentMinistry || 'Pastoral Ministry & Theological Education',
        biography: item.biography || 'Faithful servant dedicated to kingdom ministry.',
        futureAspirations: item.futureAspirations || 'Advancing the Gospel and theological education globally.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      newItems.push(candidateRecord);
      successCount++;
    });

    if (newItems.length > 0) {
      setGraduationCandidates(prev => [...newItems, ...prev]);
    }

    logGraduationAudit({
      action: 'Bulk Import Candidates',
      performedBy: currentUser.name,
      role: currentUser.role,
      details: `Bulk imported ${successCount} candidates with ${errors.length} errors.`
    });

    return { successCount, errors };
  };

  const verifyGraduationCredential = (query: { certificateNumber?: string; studentId?: string; candidateId?: string }) => {
    const certQuery = query.certificateNumber?.trim().toUpperCase();
    const stuQuery = query.studentId?.trim().toUpperCase();
    const candQuery = query.candidateId?.trim();

    const cert = graduationCertificates.find(c => {
      if (certQuery && (c.certificateNumber.toUpperCase() === certQuery || c.verificationCode.toUpperCase() === certQuery)) return true;
      if (stuQuery && c.studentId.toUpperCase() === stuQuery) return true;
      if (candQuery && c.candidateId === candQuery) return true;
      return false;
    });

    const candidate = graduationCandidates.find(c => {
      if (candQuery && c.id === candQuery) return true;
      if (stuQuery && c.studentId.toUpperCase() === stuQuery) return true;
      if (certQuery && c.certificateNumber?.toUpperCase() === certQuery) return true;
      return false;
    });

    const alumni = alumniList.find(a => {
      if (stuQuery && a.student_id?.toUpperCase() === stuQuery) return true;
      if (certQuery && a.certificate_number?.toUpperCase() === certQuery) return true;
      return false;
    });

    const found = !!(cert || candidate || alumni);
    return {
      found,
      candidate,
      certificate: cert,
      alumni,
      message: found
        ? 'VERIFIED – This academic award record has been verified by Breakthrough International Bible University.'
        : 'Credential record not found in official University Registrar database.'
    };
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        currentUser,
        setCurrentUser,
        switchRole,
        allUsers,

        authModalOpen,
        authModalTab,
        authTargetPortal,
        setAuthTargetPortal,
        authMessage,
        setAuthMessage,
        openAuthModal,
        closeAuthModal,
        registerUser,
        loginUser,
        logoutUser,
        requireAuth,

        // Graduation System Exports
        graduationCeremonies,
        addGraduationCeremony,
        updateGraduationCeremony,
        deleteGraduationCeremony,
        graduationCandidates,
        addGraduationCandidate,
        updateGraduationCandidate,
        deleteGraduationCandidate,
        updateDepartmentClearance,
        conferCandidateToGraduate,
        graduationBooklets,
        activeGraduationBooklet,
        setActiveGraduationBooklet,
        generateGraduationBooklet,
        updateGraduationBooklet,
        academicAwards,
        addAcademicAward,
        updateAcademicAward,
        deleteAcademicAward,
        graduationCertificates,
        issueGraduationCertificateRecord,
        updateGraduationCertificateRecord,
        graduationAuditLogs,
        logGraduationAudit,
        bulkImportCandidates,
        verifyGraduationCredential,

        selectedSchoolId,
        setSelectedSchoolId,
        selectedProgramId,
        setSelectedProgramId,
        selectedCourseId,
        setSelectedCourseId,
        selectedLessonId,
        setSelectedLessonId,
        selectedExamId,
        setSelectedExamId,
        selectedBulletinId,
        setSelectedBulletinId,

        universityInfo,
        updateUniversityInfo,
        schools,
        programs,
        courses,
        modules,
        assignments,
        assignmentSubmissions,
        examinations,
        examAttempts,
        grades,
        certificates,
        libraryResources,
        applications,
        rplApplications,
        announcements,
        bulletins,
        bulletinCategories,
        bulletinDepartments,
        financials,
        invoices,
        supportTickets,

        completedLessonIds,
        markLessonComplete,

        submitApplication,
        updateApplicationStatus,
        deleteApplication,
        submitRPLApplication,
        updateRPLStatus,
        deleteRPLApplication,

        submitAssignment,
        gradeAssignment,
        submitExamAttempt,
        moderateExamAttempt,

        payInvoice,
        createInvoice,
        updateInvoiceStatus,
        deleteInvoice,

        createSupportTicket,
        replySupportTicket,

        addSchool,
        updateSchool,
        deleteSchool,

        addProgram,
        updateProgram,
        deleteProgram,

        addCourse,
        updateCourse,
        deleteCourse,

        addModule,
        updateModule,
        deleteModule,
        addLesson,
        updateLesson,
        deleteLesson,

        addQuestionToBank,
        createExam,
        updateExam,
        deleteExam,
        addQuestionToExam,
        updateQuestionInExam,
        deleteQuestionFromExam,

        createCertificate,
        issueCertificate,
        updateCertificate,
        revokeCertificate,
        reinstateCertificate,
        deleteCertificate,

        addLibraryResource,
        updateLibraryResource,
        deleteLibraryResource,

        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,

        createBulletin,
        updateBulletin,
        approveBulletin,
        publishBulletin,
        unpublishBulletin,
        archiveBulletin,
        duplicateBulletin,
        deleteBulletin,
        recordBulletinView,
        recordBulletinDownload,
        verifyBulletinCode,
        addBulletinCategory,
        addBulletinDepartment,

        enrollStudentInCourse,
        unenrollStudentFromCourse,
        isStudentEnrolledInCourse,
        getStudentEnrolledCourses,
        assignStudentProgram,
        requestCourseEnrolment,
        requestModuleEnrolment,

        createUser,
        updateUser,
        deleteUser,
        updateUserRole,

        // Global Alumni System
        alumniList,
        addAlumni,
        updateAlumni,
        deleteAlumni,
        importAlumniRecords,
        verifyAlumniGraduate,
        graduateStudentToAlumni,

        // Global Examination Centre & 47-County Student Registration System
        kenyaCounties,
        globalCountries,
        examinationCentres,
        centreStudents,
        examSessions,
        examAttendanceRecords,
        auditLogs,
        selectedCentreId,
        setSelectedCentreId,
        selectedCountyCode,
        setSelectedCountyCode,
        selectedCountryCode,
        setSelectedCountryCode,

        addExaminationCentre,
        updateExaminationCentre,
        deleteExaminationCentre,
        registerStudentWithCentre,
        updateCentreStudent,
        deleteCentreStudent,
        transferStudentCentre,
        checkDuplicateStudent,
        verifyStudentDocument,
        recordExamAttendance,
        updateAttendanceStatus,
        addKenyaCounty,
        updateKenyaCounty,
        addGlobalCountry,
        updateGlobalCountry,
        logAuditEvent,
        generateStudentNumber,
        generateCentreCode,

        resetToDefaultData,

        verifyCertificateCode,
        globalSearchQuery,
        setGlobalSearchQuery,

        // BIBU TV & Radio Media Center
        mediaChannels,
        mediaVideos,
        mediaPlaylists,
        tvPrograms,
        radioPrograms,
        radioSettings,
        youtubeSettings,
        mediaPresenters,
        studentMediaProgress,
        mediaAnalytics,
        activePlayingVideo,
        setActivePlayingVideo,
        isRadioPlaying,
        setIsRadioPlaying,
        radioVolume,
        setRadioVolume,
        isRadioMuted,
        setIsRadioMuted,
        toggleRadioPlay,
        selectedMediaCategory,
        setSelectedMediaCategory,
        addMediaVideo,
        updateMediaVideo,
        deleteMediaVideo,
        reorderMediaVideos,
        addTVProgram,
        updateTVProgram,
        deleteTVProgram,
        addRadioProgram,
        updateRadioProgram,
        deleteRadioProgram,
        updateRadioSettings,
        updateYouTubeSettings,
        addMediaPresenter,
        updateMediaPresenter,
        deleteMediaPresenter,
        toggleStudentBookmarkVideo,
        toggleStudentFavoriteVideo,
        updateStudentVideoProgress,
        recordVideoView,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
