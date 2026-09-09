export type AdminRole =
  | 'Super Administrator'
  | 'Registrar'
  | 'Academic Dean'
  | 'Examination Officer'
  | 'Finance Administrator'
  | 'RPL Coordinator'
  | 'Lecturer'
  | 'Campus Administrator';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  campus: string;
  title: string;
  avatar?: string;
  lastLogin?: string;
  permissions?: string[];
}

export interface AdminSession {
  token: string;
  user: AdminUser;
  loginTime: string;
  expiresAt: string;
  ipAddress: string;
  device: string;
  active: boolean;
}

export interface FailedLoginRecord {
  email: string;
  attempts: number;
  lastAttempt: string;
  isLocked: boolean;
  lockedUntil?: number;
}

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  user: string;
  role?: string;
  userRole?: string;
  action: string;
  ipAddress: string;
  recordAffected: string;
  details?: string;
  category?: string;
}

export interface AdminCampus {
  id: string;
  name: string;
  code: string;
  country: string;
  countyOrState: string;
  city: string;
  physicalAddress: string;
  director: string;
  telephone: string;
  email: string;
  examinationCenter: boolean;
  studyMode: ('On-Campus' | 'Online' | 'Hybrid')[];
  status: 'Active' | 'Under Development' | 'Affiliated';
  studentCount: number;
}

export interface AdminDepartment {
  id: string;
  name: string;
  code: string;
  schoolId: string;
  schoolName: string;
  hodName?: string;
  hodTitle?: string;
  headOfDepartment?: string;
  email?: string;
  programs: string[];
  lecturers?: string[];
  studentsCount?: number;
  studentCount?: number;
  lecturerCount?: number;
  status?: string;
  description?: string;
}

export type ProgramType =
  | 'Short Course'
  | 'Certificate'
  | 'Diploma'
  | "Bachelor's"
  | "Master's"
  | 'Doctorate'
  | 'Ministerial/Ecclesiastical Credential'
  | 'RPL'
  | 'Recognition of Prior Learning (RPL)';

export interface AdminProgram {
  id: string;
  name: string;
  code: string;
  programType?: ProgramType;
  type?: string;
  award: string;
  schoolId?: string;
  schoolName: string;
  departmentId?: string;
  departmentName?: string;
  department?: string;
  duration: string;
  entryRequirements: string;
  studyMode: ('Online' | 'On-Campus' | 'Hybrid' | 'Distance Learning')[];
  fees: number;
  currency?: string;
  scholarshipAvailable: boolean;
  scholarshipDetails?: string;
  curriculum?: { semester: string; courses: string[] }[];
  curriculumUnits?: string[];
  units?: number;
  examinationRequirements: string;
  status: 'Active' | 'Under Review' | 'Phasing Out';
  enrolledStudentsCount?: number;
}

export type StudentStatus =
  | 'Active'
  | 'Probation'
  | 'Suspended'
  | 'Withdrawn'
  | 'Graduated'
  | 'Deferred'
  | 'Transferred';

export interface AdminStudentProfile {
  id: string;
  studentId: string;
  admissionNumber: string;
  fullName: string;
  email: string;
  telephone: string;
  country: string;
  campus: string;
  school: string;
  department: string;
  program: string;
  intake: string;
  admissionDate: string;
  studyMode: 'Online' | 'On-Campus' | 'Hybrid' | 'Distance Learning';
  status: StudentStatus;
  profilePhoto?: string;
  gpa?: number;
  creditsEarned?: number;
  totalRequiredCredits?: number;
  financialBalance?: number;
  feeBalance?: number;
  coursesEnrolled?: number;
  totalCreditsCompleted?: number;
  currency?: string;
  ministryAffiliation?: string;
}

export type PastStudentStatus =
  | 'Completed'
  | 'Graduated'
  | 'Withdrawn'
  | 'Deferred'
  | 'Suspended'
  | 'Transferred';

export interface PastStudentProfile {
  id: string;
  studentId?: string;
  admissionNumber: string;
  fullName: string;
  email?: string;
  country?: string;
  campus?: string;
  school?: string;
  program?: string;
  status: PastStudentStatus;
  graduationYear?: number;
  ceremonyName?: string;
  ceremony?: string;
  award?: string;
  certificateNumber?: string;
  transcriptNumber?: string;
  alumniNumber?: string;
  graduationHonors?: string;
  currentMinistry?: string;
  completionDate?: string;
}

export type PastStudentRecord = PastStudentProfile;

export interface AdminLecturerProfile {
  id: string;
  lecturerId: string;
  name: string;
  email: string;
  phone: string;
  qualifications: string;
  school: string;
  department: string;
  courses?: string[];
  assignedCourses?: string[];
  campus: string;
  employmentStatus: 'Full-time' | 'Adjunct' | 'Visiting Professor' | 'Visiting Scholar' | 'Emeritus' | 'Full-Time';
  bio?: string;
  avatar?: string;
  activeStudents?: number;
  activeStudentsCount?: number;
  status?: 'Active' | 'On Leave' | 'Inactive';
}

export type EnrollmentStatus =
  | 'Pending'
  | 'Approved'
  | 'Active'
  | 'Completed'
  | 'Graduated'
  | 'PENDING'
  | 'APPROVED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'GRADUATED';

export type EnrollmentWorkflowStatus = EnrollmentStatus;

export interface AdminEnrollmentRecord {
  id: string;
  enrollmentNumber: string;
  studentId?: string;
  studentName: string;
  studentEmail?: string;
  program: string;
  school: string;
  department: string;
  campus: string;
  intake: string;
  date: string;
  studyMode: 'Online' | 'On-Campus' | 'Hybrid' | 'Distance Learning';
  status: EnrollmentStatus;
  paymentStatus: 'Paid' | 'Partial' | 'Pending' | 'Scholarship';
}

export type AdminEnrollment = AdminEnrollmentRecord;

export interface CourseInProgress {
  id: string;
  studentId?: string;
  studentName: string;
  studentAdmNo?: string;
  program: string;
  courseId?: string;
  courseCode: string;
  courseName?: string;
  courseTitle?: string;
  lecturerName?: string;
  lecturer?: string;
  startDate: string;
  completionPercentage: number;
  assignmentsCompleted?: number;
  examsCompleted?: number;
  assignments?: { completed: number; total: number };
  exams?: { completed: number; total: number; score?: number };
  currentGrade?: string;
  grade?: string;
  status: string;
}

export type CourseInProgressRecord = CourseInProgress;

export type HonoraryStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Approved'
  | 'Rejected'
  | 'Awarded';

export interface HonoraryApplication {
  id: string;
  applicationNumber: string;
  candidateName: string;
  email: string;
  phone: string;
  currentTitle: string;
  ministryOrganization: string;
  country: string;
  honoraryDegree: string;
  nominationCategory: string;
  rationale: string;
  ministryTenureYears: number;
  achievements: string[];
  citations: string;
  documents: { name: string; type: string; size: string; url?: string }[];
  status: HonoraryStatus;
  reviewComments?: string;
  decisionDate?: string;
  awardCertificateNumber?: string;
  nominationDate: string;
}

export type AdminSidebarCategory =
  | 'ACADEMIC MANAGEMENT'
  | 'EXAMINATION MANAGEMENT'
  | 'RPL MANAGEMENT'
  | 'GRADUATION'
  | 'FINANCE'
  | 'COMMUNICATION'
  | 'REPORTS'
  | 'SYSTEM';

export type AdminNavigationItem =
  // Academic Management
  | 'dashboard'
  | 'honorary-applications'
  | 'schools'
  | 'campuses'
  | 'departments'
  | 'programs'
  | 'students'
  | 'past-students'
  | 'lecturers'
  | 'enrollments'
  | 'courses-in-progress'
  // Examination Management
  | 'examinations'
  | 'exam-centers'
  | 'exam-candidates'
  | 'exam-results'
  | 'transcripts'
  | 'certificates'
  // RPL Management
  | 'rpl-candidates'
  | 'rpl-applications'
  | 'rpl-portfolios'
  | 'rpl-assessments'
  | 'rpl-results'
  // Graduation
  | 'graduation-ceremonies'
  | 'graduates-list'
  | 'graduation-booklets'
  | 'alumni-management'
  // Finance
  | 'fees-structure'
  | 'payments'
  | 'scholarships'
  | 'financial-reports'
  // Communication
  | 'announcements'
  | 'notifications'
  | 'email-sms'
  // Reports
  | 'reports-students'
  | 'reports-academic'
  | 'reports-enrollments'
  | 'reports-graduation'
  | 'reports-examinations'
  | 'reports-financial'
  // System
  | 'system-users'
  | 'system-roles'
  | 'system-audit-logs'
  | 'system-settings'
  | 'system-backup'
  | 'logout';
