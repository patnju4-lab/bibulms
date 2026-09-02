/**
 * Breakthrough International Bible University (BIBU)
 * Global Examination Centre Management, Admission & Student Registration System Types
 */

export type ContinentCode = 'AFRICA' | 'NORTH_AMERICA' | 'SOUTH_AMERICA' | 'EUROPE' | 'ASIA' | 'OCEANIA';

export type KenyaRegion = 
  | 'Nairobi'
  | 'Central'
  | 'Coast'
  | 'Eastern'
  | 'North Eastern'
  | 'Rift Valley'
  | 'Western'
  | 'Nyanza';

export interface KenyaCounty {
  id: string;
  countyCode: number; // 1 to 47
  codeString: string; // "001", "047", etc.
  name: string;
  region: KenyaRegion;
  headquarters: string;
  active: boolean;
  centreCount: number;
  studentCount: number;
  candidateCount: number;
  countyRepresentativeName: string;
  representativePhone: string;
  representativeEmail: string;
  officeAddress: string;
  postalAddress?: string;
  latitude?: number;
  longitude?: number;
}

export interface GlobalCountry {
  id: string;
  countryCode: string; // ISO 2/3 letter code, e.g., 'KE', 'UG', 'TZ', 'US', 'NG', 'GH', 'ZA', 'UK', 'IN'
  countryName: string;
  continent: ContinentCode;
  dialCode: string;
  active: boolean;
  nationalRepresentativeId?: string;
  nationalRepresentativeName: string;
  nationalRepresentativeEmail: string;
  nationalRepresentativePhone: string;
  officeLocation: string;
  totalCentresCount: number;
  totalStudentsCount: number;
  totalExamCandidatesCount: number;
  currency: string;
}

export type CentreType = 
  | 'Main Examination Centre'
  | 'County Examination Centre'
  | 'Regional Examination Centre'
  | 'National Examination Centre'
  | 'International Examination Centre'
  | 'Special Examination Centre'
  | 'Online/Remote Examination Centre';

export type CentreStatus = 
  | 'Pending'
  | 'Under Review'
  | 'Approved'
  | 'Active'
  | 'Suspended'
  | 'Closed';

export interface CentreRoom {
  id: string;
  roomName: string;
  roomNumber: string;
  capacity: number;
  isComputerLab: boolean;
  computerCount: number;
  hasCctv: boolean;
  hasAc: boolean;
  wheelchairAccessible: boolean;
}

export interface ExaminationCentre {
  id: string;
  centreCode: string; // e.g. BIBU-KE-001-NAI, BIBU-UG-001-KLA, BIBU-US-001-PHX
  centreName: string;
  continent: ContinentCode;
  countryCode: string;
  countryName: string;
  countyOrState: string; // County for KE (e.g. "Nairobi", "Mombasa"), State for US, Province/Region for others
  countyCode?: number; // 1-47 if Kenya
  cityOrTown: string;
  physicalAddress: string;
  gpsCoordinates?: {
    latitude: number;
    longitude: number;
  };
  centreType: CentreType;
  centreStatus: CentreStatus;
  capacity: number;
  enrolledStudentsCount: number;
  registeredCandidatesCount: number;
  availableSeats: number; // capacity - registeredCandidatesCount
  
  // Representative & Contact
  representativeId?: string;
  representativeName: string;
  representativeRole: string; // e.g., "Senior Pastor", "Bishop", "Centre Director"
  phone: string;
  email: string;
  alternateContact?: string;
  alternatePhone?: string;
  
  // Facilities & Infrastructure
  rooms: CentreRoom[];
  totalComputers: number;
  internetAvailability: 'High-Speed Fiber / Dedicated WiFi' | 'Cellular 4G/5G' | 'Satellite Starlink' | 'Offline Backup Only';
  backupPowerGenerator: boolean;
  accessibilityInfo: string;
  securityArrangements: string;
  institutionAffiliation?: string; // Church/Collegiate partner hosting the centre
  
  // Dates & Auditing
  registrationDate: string;
  approvalDate: string;
  expiryOrReviewDate: string;
  lastAuditedDate?: string;
  approvedBy?: string;
  isMainCampus?: boolean;
}

export type ApplicationWorkflowStatus =
  | 'Draft'
  | 'Submitted'
  | 'Documents Pending'
  | 'Under Review'
  | 'Centre Verified'
  | 'Academically Approved'
  | 'Admitted'
  | 'Registered'
  | 'Rejected'
  | 'Deferred';

export interface CentreStudentDocument {
  id: string;
  documentType: 
    | 'National ID'
    | 'Passport'
    | 'Passport Photograph'
    | 'KCSE Certificate'
    | 'High School Diploma'
    | 'Diploma Certificate'
    | 'Degree Certificate'
    | 'Academic Transcript'
    | 'Pastoral Recommendation Letter'
    | 'Ministry Certificate'
    | 'RPL Portfolio Evidence'
    | 'Other Supporting Document';
  fileName: string;
  fileSize: string;
  uploadDate: string;
  verificationStatus: 'Pending' | 'Verified' | 'Rejected' | 'Requires Re-upload';
  verifiedBy?: string;
  verificationDate?: string;
  remarks?: string;
  fileUrl?: string;
}

export interface CentreStudent {
  id: string;
  studentNumber: string; // e.g. BIBU/2026/KE/NAI/0001
  applicationNumber: string; // e.g. APP-2026-KE-0042
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  nationality: string;
  nationalIdOrPassport: string;
  passportPhotoUrl?: string;
  phone: string;
  email: string;
  residentialAddress: string;
  
  // Geographic & Centre Association
  continent: ContinentCode;
  country: string;
  countryCode: string;
  countyOrState: string;
  countyCode?: number;
  cityOrTown: string;
  examinationCentreId: string;
  examinationCentreCode: string;
  examinationCentreName: string;
  
  // Academic & Programme Data
  schoolId: string;
  schoolName: string;
  programId: string;
  programName: string;
  academicLevel: 'Certificate' | 'Diploma' | 'Bachelor' | 'Master' | 'Doctorate';
  modeOfStudy: 'Digital Online & Centre-Based' | 'Intensive Hybrid' | 'Centre Weekend Cohort' | 'Full-Time Distance';
  intake: 'January 2026' | 'May 2026' | 'September 2026' | 'January 2027';
  academicYear: string;
  studyDurationMonths: number;
  admissionDate: string;
  registrationDate: string;
  
  // Prior Education
  previousInstitution: string;
  highestQualification: string;
  qualificationGrade: string;
  yearCompleted: number;
  
  // Statuses
  admissionStatus: ApplicationWorkflowStatus;
  studentStatus: 'Active' | 'On Leave' | 'Suspended' | 'Graduated' | 'Transferred' | 'Withdrawn';
  feeStatus: 'Fully Paid' | 'Partial Balance' | 'Scholarship' | 'Pending Invoice';
  courseworkStatus: 'In Good Standing' | 'Pending Submissions' | 'At Risk' | 'Completed';
  examinationEligibility: 'Eligible & Cleared' | 'Financial Hold' | 'Coursework Incomplete' | 'Pending Verification';
  currentExamSeatNumber?: string;
  currentExamRoom?: string;
  
  // Academic Performance & RPL
  currentGpa: number;
  creditsEarned: number;
  totalRequiredCredits: number;
  rplGrantedCredits?: number;
  rplStatus?: string;
  
  // Documents
  documents: CentreStudentDocument[];
  
  // History & Audit
  centreTransferHistory: StudentTransferAudit[];
  createdAt: string;
  updatedAt: string;
}

export interface StudentTransferAudit {
  id: string;
  transferDate: string;
  fromCentreId: string;
  fromCentreCode: string;
  fromCentreName: string;
  fromCountry: string;
  fromCounty: string;
  toCentreId: string;
  toCentreCode: string;
  toCentreName: string;
  toCountry: string;
  toCounty: string;
  authorizedByAdminName: string;
  authorizedByAdminRole: string;
  reason: string;
  approvalStatus: 'Approved' | 'Pending Review' | 'Completed';
  studentNotificationSent: boolean;
  notificationTimestamp?: string;
  remarks?: string;
}

export interface ExaminationSession {
  id: string;
  sessionCode: string; // e.g. "EXAM-2026-OCT-S1"
  title: string;
  academicYear: string;
  intake: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  status: 'Upcoming' | 'Registration Open' | 'In Progress' | 'Grading' | 'Published' | 'Archived';
  eligibleLevels: ('Certificate' | 'Diploma' | 'Bachelor' | 'Master' | 'Doctorate')[];
  totalRegisteredGlobal: number;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Withdrawn' | 'Special Consideration';

export interface CentreExamAttendanceRecord {
  id: string;
  examSessionId: string;
  examinationId: string;
  courseCode: string;
  courseTitle: string;
  centreId: string;
  centreCode: string;
  studentId: string;
  studentNumber: string;
  studentName: string;
  studentPhotoUrl?: string;
  nationalIdOrPassport: string;
  seatNumber: string;
  roomNumber: string;
  attendanceStatus: AttendanceStatus;
  idVerified: boolean;
  examCardPresented: boolean;
  timeIn?: string;
  timeOut?: string;
  invigilatorName: string;
  studentSignatureRecorded: boolean;
  remarks?: string;
  updatedAt: string;
}

export interface CentreExamRegistration {
  id: string;
  sessionId: string;
  studentId: string;
  studentNumber: string;
  studentName: string;
  programName: string;
  level: string;
  centreId: string;
  centreCode: string;
  registeredUnits: {
    courseId: string;
    courseCode: string;
    courseTitle: string;
    credits: number;
    examDate: string;
    timeSlot: string;
    room: string;
    seatNumber: string;
  }[];
  eligibilityStatus: 'Eligible & Cleared' | 'Pending Clearance' | 'Disqualified';
  feeClearance: boolean;
  courseworkClearance: boolean;
  hallTicketNumber: string;
  generatedDate: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userName: string;
  userEmail: string;
  userRole: string;
  action: 
    | 'STUDENT_ADMISSION_CREATED'
    | 'STUDENT_CENTRE_ASSIGNED'
    | 'STUDENT_CENTRE_TRANSFERRED'
    | 'STUDENT_NUMBER_GENERATED'
    | 'DOCUMENT_VERIFIED'
    | 'DOCUMENT_REJECTED'
    | 'CENTRE_CREATED'
    | 'CENTRE_UPDATED'
    | 'CENTRE_STATUS_CHANGED'
    | 'EXAM_REGISTRATION'
    | 'ATTENDANCE_RECORDED'
    | 'REPRESENTATIVE_ASSIGNED'
    | 'USER_ROLE_CHANGED'
    | 'DUPLICATE_CHECK_OVERRIDE';
  affectedEntity: string; // e.g. "Student BIBU/2026/KE/NAI/0001", "Centre BIBU-KE-001-NAI"
  affectedId: string;
  previousValue?: string;
  newValue?: string;
  ipAddress: string;
  details: string;
}

export interface NationalRepresentative {
  id: string;
  name: string;
  title: string; // e.g. "National Director", "Bishop"
  email: string;
  phone: string;
  countryCode: string;
  countryName: string;
  continent: ContinentCode;
  appointmentDate: string;
  status: 'Active' | 'On Leave' | 'Suspended';
  headOfficeAddress: string;
  managedCentresCount: number;
  totalStudentsUnderSupervision: number;
}
