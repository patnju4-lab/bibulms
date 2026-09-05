export type Role = 
  | 'guest' 
  | 'registered' 
  | 'student' 
  | 'faculty' 
  | 'registrar' 
  | 'examiner' 
  | 'admissions' 
  | 'alumni' 
  | 'ministry_member' 
  | 'moderator' 
  | 'national_rep'
  | 'centre_rep'
  | 'regional_rep'
  | 'county_rep'
  | 'invigilator'
  | 'finance_admin'
  | 'admin' 
  | 'superadmin';

export * from './examCentres';

export type AccountType =
  | 'Prospective Student'
  | 'Current Student'
  | 'Faculty/Instructor'
  | 'University Staff'
  | 'Alumni'
  | 'Pastor/Minister'
  | 'Christian Worker'
  | 'Ministry Leader'
  | 'Fellowship Member'
  | 'Other';

export type VerificationStatus = 'verified' | 'pending_verification' | 'unverified';

export type AcademicLevel = 'Certificate' | 'Diploma' | 'Bachelor' | 'Master' | 'Doctorate' | 'Faculty / Postdoc' | 'All';

export interface UserLoginRecord {
  id: string;
  timestamp: string;
  ipAddress: string;
  device: string;
  location: string;
}

export interface User {
  id: string;
  name: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email: string;
  password?: string;
  phone?: string;
  role: Role;
  accountType?: AccountType;
  verificationStatus?: VerificationStatus;
  avatar?: string;
  title?: string;
  country: string;
  timeZone?: string;
  preferredLanguage?: string;
  studentId?: string;
  facultyId?: string;
  programId?: string;
  programName?: string;
  enrolledCourseIds?: string[];
  schoolId?: string;
  currentSemester?: string;
  admissionYear?: number;
  gpa?: number;
  creditsEarned?: number;
  totalRequiredCredits?: number;
  financialBalance?: number;
  currency?: string;
  bio?: string;
  ministryAffiliation?: string;
  status?: 'active' | 'suspended';
  createdAt?: string;
  twoFactorEnabled?: boolean;
  passkeyRegistered?: boolean;
  authorizedPortals?: string[];
  loginHistory?: UserLoginRecord[];
  unreadNotificationsCount?: number;
  unreadMessagesCount?: number;
}

export interface UniversityInfo {
  name: string;
  shortName: string;
  tagline: string;
  motto: string;
  location: string;
  address: string;
  email: string;
  registrarEmail: string;
  phone: string;
  chancellor: string;
  chancellorTitle: string;
  registrar: string;
  accreditation: string;
  established: number;
  activeCountries: number;
  alumniCount: number;
  currentEnrollment: number;
  heroHeadline?: string;
  heroSubtitle?: string;
  announcementTicker?: string;
}

export interface School {
  id: string;
  name: string;
  code: string;
  deanName: string;
  deanTitle: string;
  description: string;
  iconName: string;
  departments: string[];
  programsCount: number;
}

export interface Program {
  id: string;
  schoolId: string;
  name: string;
  code: string;
  level: AcademicLevel;
  durationMonths: number;
  totalCredits: number;
  description: string;
  learningOutcomes: string[];
  careerPaths: string[];
  tuitionFeeUSD: number;
  featured?: boolean;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  schoolId: string;
  programIds: string[];
  creditHours: number;
  credits?: number;
  level: AcademicLevel;
  semester: string;
  instructorId: string;
  instructorName: string;
  instructor?: string;
  description: string;
  learningOutcomes: string[];
  prerequisites: string[];
  modulesCount: number;
  coverImage?: string;
  biblePassages: string[];
  scriptureReferences?: string[];
  enrolledStudentsCount: number;
}

export type CourseModule = Module;

export interface Module {
  id: string;
  courseId: string;
  order: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  courseId: string;
  order: number;
  title: string;
  introduction: string;
  scriptureReferences: string[];
  notes: string;
  keyConcepts: string[];
  ministryApplication: string;
  reflectionQuestions: string[];
  videoUrl?: string;
  audioUrl?: string;
  audioDuration?: string;
  downloadableMaterials: {
    title: string;
    type: 'PDF' | 'DOC' | 'SLIDES';
    size: string;
  }[];
  quizId?: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  instructions: string;
  dueDate: string;
  maxMarks: number;
  rubric: { criteria: string; points: number }[];
  submissionsCount: number;
  status: 'Open' | 'Closed' | 'Graded';
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  content: string;
  fileName?: string;
  fileSize?: string;
  grade?: number;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: string;
  status: 'Submitted' | 'Graded' | 'Under Review';
}

export interface Question {
  id: string;
  courseId: string;
  topic: string;
  type: 'multiple_choice' | 'true_false' | 'scripture_match' | 'short_essay';
  prompt: string;
  options?: string[];
  correctAnswerIndex?: number;
  correctAnswerText?: string;
  scriptureReference?: string;
  points: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
}

export interface Quiz {
  id: string;
  courseId: string;
  lessonId?: string;
  title: string;
  timeLimitMinutes: number;
  passMarkPercentage: number;
  questions: Question[];
}

export type Exam = Examination;
export type ExamQuestion = Question;

export interface Examination {
  id: string;
  code: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  title: string;
  instructions: string;
  durationMinutes: number;
  totalMarks: number;
  passMarks: number;
  passingPercentage?: number;
  status: 'Scheduled' | 'Active' | 'Moderation' | 'Published';
  scheduledDate: string;
  questions: Question[];
  chiefExaminer: string;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  startedAt: string;
  completedAt?: string;
  score?: number;
  percentage?: number;
  grade?: string;
  answers: { [questionId: string]: string | number };
  status: 'In Progress' | 'Submitted' | 'Graded' | 'Moderated';
  examinerComments?: string;
}

export interface GradeRecord {
  id: string;
  studentId: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  creditHours: number;
  semester: string;
  year: number;
  assignmentScore: number;
  quizScore: number;
  examScore: number;
  totalScore: number;
  letterGrade: 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'D' | 'F';
  gradePoint: number;
  instructorName?: string;
  schoolName?: string;
  status?: 'Completed' | 'Conferred' | 'In Progress';
  academicStanding?: string;
  qualityPoints?: number;
}

export interface SemesterSummary {
  term: string;
  year: number;
  courses: GradeRecord[];
  creditsAttempted: number;
  creditsEarned: number;
  totalQualityPoints: number;
  termGpa: number;
  academicStanding: string;
}

export interface Application {
  id: string;
  applicationNumber: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  country: string;
  churchAffiliation: string;
  ministryExperienceYears: number;
  currentMinistryRole: string;
  desiredProgramId: string;
  desiredProgramName: string;
  previousEducation: string;
  statementOfPurpose: string;
  referenceName: string;
  referenceContact: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Accepted' | 'Approved' | 'Conditionally Accepted' | 'Enrolled' | 'Rejected';
  submittedDate: string;
  documents: { name: string; type: string; size: string }[];
  adminNotes?: string;
}

export interface RPLApplication {
  id: string;
  applicationNumber: string;
  applicantName: string;
  email: string;
  phone: string;
  targetProgram: string;
  yearsInMinistry: number;
  ministryField: string;
  portfolioSummary: string;
  evidenceItems: { title: string; category: string; description: string }[];
  requestedCredits: number;
  approvedCredits?: number;
  status: 'Submitted' | 'Portfolio Review' | 'Interview Scheduled' | 'Credits Awarded' | 'Rejected';
  assessorName?: string;
  assessorNotes?: string;
  dateSubmitted: string;
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  studentId: string;
  studentName: string;
  programName: string;
  degreeTitle: string;
  schoolName: string;
  conferralDate: string;
  honors?: string;
  verificationCode: string;
  status: 'Valid' | 'Revoked' | 'Pending';
  chancellorName: string;
  registrarName: string;
}

export type LibraryResourceType = 
  | 'Exegetical Commentary'
  | 'Systematic Treatise'
  | 'Greek & Hebrew Lexicon'
  | 'Grammar & Syntax Manual'
  | 'Pastoral Protocol'
  | 'Academic Journal Article'
  | 'Theses & Dissertations'
  | 'Faculty Publication'
  | 'Historical Patristic Text'
  | 'Audio Lecture'
  | 'Audio Book'
  | 'Audio Course'
  | 'Video Seminar'
  | 'Video Book'
  | 'Video Course'
  | 'Research Paper'
  | 'E-Book / Monograph';

export type LibraryCollectionCategory =
  | 'All'
  | 'E-Books'
  | 'Audio Books'
  | 'Audio Courses'
  | 'Video Books'
  | 'Video Courses'
  | 'Academic Treatises'
  | 'Research Papers'
  | 'Exegetical Commentaries'
  | 'Greek & Hebrew'
  | 'Church History'
  | 'Pastoral Protocols'
  | 'Journals'
  | 'Faculty Publications'
  | 'My Library'
  // Legacy category support
  | 'Bible Studies'
  | 'Greek & Hebrew Research'
  | 'Religion & Church History'
  | 'Pastoral Ministry'
  | 'Academic Research & Theses'
  | 'Systematic Theology';

export type MediaLicenseType = 
  | 'BIBU-owned'
  | 'Faculty-created'
  | 'Public domain'
  | 'Open Educational Resource'
  | 'Creative Commons'
  | 'Licensed'
  | 'Permission granted'
  | 'Restricted'
  | 'Streaming only'
  | 'Download prohibited';

export interface TranscriptItem {
  id: string;
  timestampSeconds: number;
  formattedTimestamp: string;
  speaker?: string;
  text: string;
  scriptureRef?: string;
  paragraphId?: number;
}

export interface MediaChapter {
  id: string;
  chapterNumber: number;
  title: string;
  duration?: string;
  durationSeconds?: number;
  durationFormatted?: string;
  pageStart?: number;
  pageEnd?: number;
  audioUrl?: string;
  videoUrl?: string;
  summary?: string;
  description?: string;
  transcript?: TranscriptItem[];
  scriptureRefs?: string[];
  completed?: boolean;
}

export interface AudioLesson {
  id: string;
  lessonNumber: number;
  title: string;
  duration: string;
  durationSeconds: number;
  audioUrl: string;
  description: string;
  transcript: TranscriptItem[];
  downloadAllowed?: boolean;
  readingRef?: string;
  completed?: boolean;
}

export interface AudioCourseModule {
  id: string;
  moduleNumber: number;
  title: string;
  description: string;
  lessons: AudioLesson[];
}

export interface VideoLesson {
  id: string;
  lessonNumber: number;
  title: string;
  duration: string;
  durationSeconds: number;
  videoUrl: string;
  posterUrl?: string;
  description: string;
  transcript: TranscriptItem[];
  requiredReading?: string;
  quizQuestionsCount?: number;
  assignmentTitle?: string;
  slidesUrl?: string;
  chapterMarkers?: { title: string; timestampSeconds: number }[];
  completed?: boolean;
}

export interface VideoCourseModule {
  id: string;
  moduleNumber: number;
  title: string;
  description: string;
  lessons: VideoLesson[];
}

export interface SynchronizedParagraph {
  id: string;
  paragraphNumber: number;
  heading?: string;
  text: string;
  audioStartSeconds?: number;
  audioEndSeconds?: number;
  timestampStartSeconds?: number;
  timestampEndSeconds?: number;
  scriptureRefs?: string[];
}

export interface UserMediaBookmark {
  id: string;
  resourceId: string;
  resourceTitle: string;
  resourceType: string;
  mediaFormat: 'ebook' | 'audio' | 'video' | 'research' | 'course';
  timestampSeconds?: number;
  formattedTimestamp?: string;
  pageNumber?: number;
  chapterOrLessonTitle?: string;
  label: string;
  createdAt: string;
}

export interface UserMediaNote {
  id: string;
  resourceId: string;
  resourceTitle: string;
  mediaFormat: 'ebook' | 'audio' | 'video' | 'transcript' | 'lesson';
  timestampSeconds?: number;
  formattedTimestamp?: string;
  pageNumber?: number;
  lessonId?: string;
  scriptureRef?: string;
  selectedText?: string;
  noteContent: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UnifiedLearningProgress {
  resourceId: string;
  mediaFormat: 'ebook' | 'audiobook' | 'audio_course' | 'videobook' | 'video_course' | 'document';
  pagesRead?: number;
  totalPages?: number;
  secondsListened?: number;
  totalAudioDuration?: number;
  secondsWatched?: number;
  totalVideoDuration?: number;
  currentChapterIndex?: number;
  currentChapterTitle?: string;
  currentLessonId?: string;
  currentLessonTitle?: string;
  lastTimestamp?: number;
  lastFormattedTimestamp?: string;
  lastSessionDate: string;
  percentageCompleted: number;
  isCompleted: boolean;
  completionDate?: string;
  sessionsCount: number;
}

export interface LibraryResource {
  id: string;
  title: string;
  author: string;
  publisher?: string;
  category: 'Bible' | 'Theology' | 'Biblical Studies' | 'Church History' | 'Missions' | 'Leadership' | 'Christian Counseling' | 'Christian Education' | 'Research' | 'Pastoral Protocols' | 'Biblical Languages';
  collectionCategory?: LibraryCollectionCategory;
  resourceType?: LibraryResourceType;
  format: 'PDF' | 'Book Excerpt' | 'Audio Lecture' | 'Video Lecture' | 'Journal' | 'Audio Book' | 'Audio Course' | 'Video Book' | 'Video Course';
  pagesOrDuration: string;
  year: number;
  description: string;
  abstract?: string;
  downloadUrl?: string;
  coverColor: string;
  coverImage?: string;
  isPopular?: boolean;
  isFeatured?: boolean;
  isRecommended?: boolean;
  academicLevel?: AcademicLevel;
  language?: string;
  scriptureReferences?: string[];
  keywords?: string[];
  isbnOrDoi?: string;
  edition?: string;
  peerReviewed?: boolean;
  licenseType?: 'Public Domain' | 'Open Access' | 'BIBU Institutional License' | 'Creative Commons' | 'Authorized Academic Use' | 'Public Domain & Academic Commentary';
  licenseClassification?: MediaLicenseType;
  rightsStatement?: string;
  assignedCourseCodes?: string[];
  fullTextContent?: string;
  tableOfContents?: { title: string; page: number }[];
  
  // Multimedia features
  audioUrl?: string;
  videoUrl?: string;
  audioDurationSeconds?: number;
  videoDurationSeconds?: number;
  audioChapters?: MediaChapter[];
  videoChapters?: MediaChapter[];
  audioModules?: AudioCourseModule[];
  videoModules?: VideoCourseModule[];
  synchronizedParagraphs?: SynchronizedParagraph[];
  transcript?: TranscriptItem[];
  downloadAllowed?: boolean;
  completionThresholdPercent?: number; // default 90%
  supportingSlidesUrl?: string;
  diagrams?: { title: string; description: string; imageUrl?: string }[];
  canSwitchFormats?: boolean; // WATCH | READ | LISTEN

  citationApa?: string;
  citationMla?: string;
  citationChicago?: string;
  citationHarvard?: string;
}

export interface PastoralProtocol {
  id: string;
  title: string;
  code: string;
  category: 'Pastoral Care' | 'Sacraments & Ordinances' | 'Safeguarding & Protection' | 'Counseling & Mental Health' | 'Leadership & Discipline' | 'Crisis & Chaplaincy';
  targetAudience: string;
  version: string;
  lastReviewed: string;
  authoritativeBody: string;
  purpose: string;
  scope: string;
  theologicalFoundation: string;
  scripturePassages: string[];
  keyDefinitions: { term: string; definition: string }[];
  keyResponsibilities: { role: string; responsibility: string }[];
  stepByStepProcedure: {
    stepNumber: number;
    title: string;
    description: string;
    criticalNotes?: string;
  }[];
  ethicalConsiderations: string[];
  safeguardingNotes: string;
  documentationRequirements: string[];
  mandatoryReferralThresholds: string[];
  downloadFileName?: string;
}

export interface BiblicalWordEntry {
  id: string;
  strongsNumber: string; // e.g. G26, H7307
  originalWord: string; // Greek / Hebrew font
  transliteration: string; // e.g. agape, ruach
  language: 'Greek' | 'Hebrew' | 'Aramaic';
  partOfSpeech: string;
  pronunciation: string;
  rootWord?: string;
  shortDefinition: string;
  theologicalSignificance: string;
  occurrenceCount: number;
  testament: 'Old Testament' | 'New Testament';
  keyPassages: { verse: string; excerpt: string; context: string }[];
  semanticNuances: string[];
  relatedStrongs: string[];
  scholarlyNotes: string;
}

export interface FacultyReadingAssignment {
  id: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  instructorName: string;
  resourceId: string;
  resourceTitle: string;
  resourceAuthor: string;
  requiredPages: string;
  dueDate: string;
  instructions: string;
  isRequired: boolean;
  totalEnrolledStudents: number;
  completedStudentsCount: number;
}

export interface StudentLibraryAnnotation {
  id: string;
  resourceId: string;
  studentId: string;
  pageNumber: number;
  selectedText: string;
  noteText: string;
  color: 'yellow' | 'green' | 'blue' | 'purple' | 'amber';
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  studentId: string;
  studentName: string;
  category: 'Academic Advising' | 'Technical Support' | 'Admissions' | 'Finance / Fees' | 'Examination Inquiry';
  subject: string;
  message: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  responses: { sender: string; message: string; date: string; isStaff: boolean }[];
}

export interface Announcement {
  id: string;
  title: string;
  category: 'Academic' | 'Examination' | 'Spiritual / Chapel' | 'Admissions' | 'Graduation';
  content: string;
  date: string;
  isUrgent?: boolean;
  author: string;
}

export type BulletinCategory =
  | 'University News'
  | 'Academic Notices'
  | 'Examination Notices'
  | 'Admissions'
  | 'Student Affairs'
  | 'Faculty & Staff'
  | 'Graduation'
  | 'Events'
  | 'Scholarships'
  | 'Research & Publications'
  | 'Alumni'
  | 'Ministry & Christian Leadership'
  | 'Emergency Notices'
  | string;

export type BulletinPriority = 'Normal' | 'Important' | 'Urgent' | 'Critical';

export type BulletinStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Published' | 'Scheduled' | 'Archived';

export type BulletinTargetAudience =
  | 'Everyone'
  | 'Public'
  | 'All Students'
  | 'Undergraduate Students'
  | 'Postgraduate Students'
  | 'Faculty'
  | 'Staff'
  | 'Alumni'
  | 'International Students'
  | 'Specific School'
  | 'Specific Program'
  | 'Specific Course'
  | string;

export interface BulletinAttachment {
  id?: string;
  name: string;
  type: string;
  size: string;
  downloadUrl?: string;
}

export interface BulletinImportantDate {
  label: string;
  date: string;
  description?: string;
}

export interface BulletinLink {
  label: string;
  url: string;
  isExternal?: boolean;
}

export interface BulletinEventDetails {
  title: string;
  date: string;
  time: string;
  location: string;
  isOnline: boolean;
  organizer: string;
  registrationUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  image?: string;
}

export interface BulletinAuditLog {
  action: 'Created' | 'Edited' | 'Submitted' | 'Approved' | 'Published' | 'Unpublished' | 'Archived' | 'Deleted' | 'Restored' | 'Duplicate';
  user: string;
  userRole?: string;
  timestamp: string;
  notes?: string;
}

export interface Bulletin {
  id: string;
  bulletinNumber: string;
  verificationCode: string;
  title: string;
  subtitle?: string;
  category: BulletinCategory;
  department: string;
  author: string;
  authorRole?: string;
  priority: BulletinPriority;
  targetAudience: BulletinTargetAudience;
  status: BulletinStatus;
  publishDate: string;
  publishTime?: string;
  scheduledDate?: string;
  expiryDate?: string;
  featuredImage?: string;
  summary: string;
  content: string;
  importantDates?: BulletinImportantDate[];
  instructions?: string[];
  attachments?: BulletinAttachment[];
  links?: BulletinLink[];
  contactInfo?: {
    department: string;
    email: string;
    phone?: string;
    officeLocation?: string;
  };
  eventDetails?: BulletinEventDetails;
  viewsCount: number;
  downloadsCount: number;
  isFeatured?: boolean;
  year: number;
  authorizedSignatory?: {
    name: string;
    title: string;
    signatureText?: string;
  };
  createdAt: string;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  auditLogs: BulletinAuditLog[];
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  description: string;
  amountUSD: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  paidDate?: string;
  paymentMethod?: string;
}

export interface FinancialTransaction {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  description: string;
  amount: number;
  type: 'Tuition Fee' | 'Examination Fee' | 'Graduation Fee' | 'Library & Technology Fee' | 'Scholarship Credit';
  status: 'Paid' | 'Pending' | 'Overdue';
  date: string;
  paymentMethod?: string;
}

export interface AlumniProfile {
  id: string;
  alumniId: string;
  name: string;
  degreeAwarded: string;
  graduationYear: number;
  school: string;
  country: string;
  city: string;
  currentMinistryTitle: string;
  organization: string;
  bio: string;
  ministryFocus: string;
  isVerified: boolean;
  avatarUrl?: string;
  featuredAchievement?: string;
}

export interface MinistryFellowshipGroup {
  id: string;
  title: string;
  code: string;
  category: 'Pastoral' | 'Evangelism' | 'Missions' | 'Leadership' | 'Chaplaincy' | 'Prayer' | 'Youth' | 'Counseling';
  description: string;
  coordinator: string;
  coordinatorRole: string;
  activeMembersCount: number;
  meetingSchedule: string;
  primaryScripture: string;
  regions: string[];
  topics: string[];
  bannerGradient: string;
}

export interface AlumniChapter {
  id: string;
  chapterName: string;
  region: string;
  country: string;
  chairperson: string;
  alumniCount: number;
  establishedYear: number;
  contactEmail: string;
  nextMeetingDate: string;
}

export * from './alumni';
export * from './rpl';
export * from './media';
