import { AcademicLevel } from './index';

export type GraduationCeremonyStatus = 
  | 'Planning' 
  | 'Registration Open' 
  | 'Confirmed' 
  | 'Completed' 
  | 'Archived';

export interface ProgrammeScheduleItem {
  id: string;
  order: number;
  time: string;
  activity: string;
  facilitator: string;
  roleDescription?: string;
}

export interface GraduationCeremony {
  id: string;
  graduationNumber: string; // e.g., "15th Congregation"
  academicYear: string; // e.g. "2025/2026"
  graduationYear: number; // e.g. 2026
  graduationDate: string; // YYYY-MM-DD
  graduationTime: string; // e.g. "09:30 AM (MST)"
  venue: string; // e.g. "Grand Auditorium & Cathedral of Faith"
  city: string; // e.g. "Phoenix"
  country: string; // e.g. "United States"
  theme: string; // e.g. "Equipped for Ministry, Leadership and Global Impact (2 Timothy 3:16-17)"
  chiefGuest: string;
  chancellor: string;
  viceChancellor: string;
  registrar: string;
  graduationCoordinator: string;
  status: GraduationCeremonyStatus;
  logoUrl?: string;
  bannerUrl?: string;
  description: string;
  programmeSchedule: ProgrammeScheduleItem[];
  photos: string[];
  videos: string[];
  livestreamUrl?: string;
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CandidateGraduationStatus = 
  | 'Eligible' 
  | 'Pending Clearance' 
  | 'Approved' 
  | 'Confirmed Graduate' 
  | 'Graduated' 
  | 'Deferred';

export type DepartmentClearanceStatus = 'Pending' | 'Completed' | 'Not Required' | 'Rejected';

export interface DepartmentClearanceRecord {
  department: 'Academic' | 'Examination' | 'Finance' | 'Library' | 'Student Affairs' | 'Registrar' | 'Graduation Office';
  status: DepartmentClearanceStatus;
  clearedBy?: string;
  clearedDate?: string;
  notes?: string;
  feeAmountDue?: number;
  feeAmountPaid?: number;
}

export interface GraduationCandidate {
  id: string;
  studentId: string;
  admissionNumber: string;
  fullName: string;
  firstName: string;
  lastName: string;
  profilePhoto?: string;
  gender: 'Male' | 'Female';
  nationality: string;
  country: string;
  countryCode: string;
  city: string;
  phone: string;
  email: string;
  schoolId: string;
  schoolName: string;
  programId: string;
  programName: string;
  awardLevel: AcademicLevel | 'Honorary Doctorate' | 'Diploma' | 'Certificate';
  specialization?: string;
  studyMode: 'Online / Distance Learning' | 'On-Campus Resident' | 'Hybrid Academic Track';
  campus: string;
  graduationYear: number;
  ceremonyId: string; // Linked Graduation Ceremony
  ceremonyNumber?: string;
  status: CandidateGraduationStatus;
  
  // Clearances
  clearanceProgress: number; // 0 - 100 %
  clearances: {
    academic: DepartmentClearanceRecord;
    examination: DepartmentClearanceRecord;
    finance: DepartmentClearanceRecord;
    library: DepartmentClearanceRecord;
    studentAffairs: DepartmentClearanceRecord;
    registrar: DepartmentClearanceRecord;
    graduationOffice: DepartmentClearanceRecord;
  };
  
  graduationFeeStatus: 'Paid' | 'Partial' | 'Pending' | 'Waived';
  graduationFeeAmount: number;
  graduationFeePaid: number;

  // Academic Standing & Awards
  finalGpa: number;
  academicHonors?: 
    | 'First Class Honours'
    | 'Second Class Upper Division'
    | 'Second Class Lower Division'
    | 'Summa Cum Laude'
    | 'Magna Cum Laude'
    | 'Cum Laude'
    | 'Distinction'
    | 'Merit'
    | 'Pass';
  specialAwards?: string[]; // e.g. "Valedictorian", "Chancellor's Excellence Award"
  
  // Conferred credentials
  certificateNumber?: string;
  transcriptNumber?: string;
  bookletNumber?: string;
  conferralDate?: string;
  
  // Graduate Profile details
  biography?: string;
  currentMinistry?: string;
  futureAspirations?: string;
  isAlumniMigrated?: boolean;
  alumniId?: string;

  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicAwardWinner {
  id: string;
  awardTitle: 
    | 'Valedictorian'
    | 'Salutatorian'
    | 'Best Graduating Student'
    | 'Best Academic Performance'
    | 'Best Ministry Student'
    | 'Leadership Award'
    | 'Community Service Award'
    | 'Excellence in Research'
    | 'Excellence in Christian Ministry'
    | "Chancellor's Award"
    | "Vice Chancellor's Award"
    | 'Special Recognition'
    | 'Honorary Award'
    | string;
  awardCategory: 'Academic Excellence' | 'Ministry Leadership' | 'Character & Service' | 'Special Recognition';
  candidateId: string;
  studentName: string;
  programName: string;
  schoolName: string;
  citation: string;
  presentedBy: string;
  ceremonyId: string;
}

export interface UniversityMessage {
  authorName: string;
  authorTitle: string; // e.g. "President & Chancellor", "Vice Chancellor", "University Registrar"
  messageTitle: string;
  messageContent: string[];
  photoUrl?: string;
  signatureText?: string;
}

export interface FacultyLeadershipMember {
  name: string;
  qualifications: string;
  role: string;
  departmentOrSchool: string;
  bio?: string;
}

export interface GraduationBooklet {
  id: string;
  ceremonyId: string;
  title: string;
  academicYear: string;
  edition: string;
  theme: string;
  coverImage?: string;
  status: 'Draft' | 'Published' | 'Archived';
  publishedDate?: string;
  
  // Sections
  chancellorMessage: UniversityMessage;
  viceChancellorMessage: UniversityMessage;
  registrarMessage: UniversityMessage;
  
  universityProfile: {
    history: string;
    vision: string;
    mission: string;
    coreValues: string[];
    accreditationStatement: string;
    institutionsSummary: string;
  };

  facultyBoard: FacultyLeadershipMember[];
  
  customProgrammeSchedule: ProgrammeScheduleItem[];
  
  awards: AcademicAwardWinner[];
  
  generatedAt: string;
  lastEditedBy: string;
  isDemo?: boolean;
}

export interface GraduationAuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: 
    | 'CEREMONY_CREATED'
    | 'CEREMONY_UPDATED'
    | 'CANDIDATE_ADDED'
    | 'CLEARANCE_APPROVED'
    | 'CLEARANCE_REJECTED'
    | 'STATUS_CHANGED'
    | 'CERTIFICATE_ISSUED'
    | 'BOOKLET_GENERATED'
    | 'ALUMNI_CONFERRED'
    | 'BULK_IMPORT';
  details: string;
  targetId?: string;
  targetName?: string;
}

export interface GraduationCertificateRecord {
  id: string;
  certificateNumber: string;
  studentId: string;
  candidateId?: string;
  fullName: string;
  programName: string;
  schoolName: string;
  awardLevel: string;
  honors?: string;
  graduationDate: string;
  graduationYear: number;
  ceremonyNumber: string;
  status: 'Pending' | 'Approved' | 'Issued' | 'Replaced' | 'Cancelled';
  issuedDate?: string;
  verificationCode: string;
  chancellorName: string;
  registrarName: string;
  registrarApprovalDate?: string;
  isDemo?: boolean;
}
