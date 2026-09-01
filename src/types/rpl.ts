export type RPLStatus =
  | 'Draft'
  | 'Submitted'
  | 'Screening'
  | 'Eligible'
  | 'Evidence Required'
  | 'Under Assessment'
  | 'Interview Scheduled'
  | 'Challenge Assessment Pending'
  | 'Academic Review'
  | 'Credit Approved'
  | 'Credit Partially Approved'
  | 'Credit Not Approved'
  | 'Appeal'
  | 'Completed';

export type RPLEvidenceType =
  | 'Identity Documents'
  | 'Academic Evidence'
  | 'Ministry Ordination & Licenses'
  | 'Leadership Appointments'
  | 'Sermon Outlines & Teaching Manuscripts'
  | 'Bible Study & Discipleship Materials'
  | 'Anonymized Pastoral Care Records'
  | 'Church Administration & Policy Documents'
  | 'Mission & Evangelism Reports'
  | 'Publications & Training Manuals'
  | 'Ministry Photographs & Media'
  | 'Third-Party References & Letters';

export type RPLEvidenceClassification =
  | 'Direct Evidence'
  | 'Indirect Evidence'
  | 'Documentary Evidence'
  | 'Third-Party Evidence'
  | 'Reflective Evidence'
  | 'Practical Demonstration'
  | 'Interview Evidence';

export type RPLAssessmentMethod =
  | 'Portfolio assessment'
  | 'Structured interview'
  | 'Sermon evaluation'
  | 'Bible teaching demonstration'
  | 'Practical ministry demonstration'
  | 'Reflective essay'
  | 'Case study'
  | 'Written examination'
  | 'Oral examination'
  | 'Third-party verification';

export interface RPLMinistryPosition {
  id: string;
  organization: string;
  positionTitle: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  country: string;
  cityLocation: string;
  responsibilities: string;
  peopleServed: string;
  leadershipScope: string;
  teachingHoursWeekly?: number;
  pastoralDuties: string;
  achievements: string;
  evidenceLinks?: string[];
}

export interface RPLEvidenceItem {
  id: string;
  title: string;
  classification: RPLEvidenceClassification;
  type: RPLEvidenceType;
  description: string;
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
  issuingOrganization?: string;
  dateIssued?: string;
  relatedCompetency?: string;
  verificationStatus: 'Pending' | 'Verified' | 'Requires Clarification' | 'Rejected';
  assessorComments?: string;
  score?: number;
}

export interface RPLCompetencyItem {
  id: string;
  learningOutcome: string;
  courseCode: string;
  courseTitle: string;
  creditValue: number;
  selfRating: 1 | 2 | 3 | 4 | 5; // 1: Beginner, 2: Developing, 3: Competent, 4: Proficient, 5: Advanced
  demonstrationMethod: string;
  applicantNarrative?: string;
  assessorDecision: 'Pending' | 'Credit Awarded' | 'Partial Credit' | 'Challenge Assessment Required' | 'Additional Evidence Required' | 'Not Yet Competent' | 'Credit Not Recommended';
  awardedCredits?: number;
  assessorNotes?: string;
}

export interface RPLReference {
  id: string;
  name: string;
  roleTitle: string;
  organization: string;
  email: string;
  phone: string;
  relationshipYears: number;
  referenceLetterStatus: 'Received' | 'Requested' | 'Pending';
  referenceNotes?: string;
}

export interface RPLAuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  notes?: string;
}

export interface RPLAppeal {
  id: string;
  dateSubmitted: string;
  groundsForAppeal: string;
  applicantStatement: string;
  supportingEvidenceNotes: string;
  status: 'Submitted' | 'Under Review' | 'Additional Information Required' | 'Appeal Hearing' | 'Approved' | 'Partially Approved' | 'Not Approved' | 'Closed';
  reviewerName?: string;
  reviewerDecision?: string;
  decisionDate?: string;
}

export interface RPLApplicationRecord {
  id: string;
  applicationNumber: string; // e.g. BIBU-RPL-2026-000104
  verificationCode: string;
  studentId?: string;
  userId?: string;
  applicantName: string;
  email: string;
  phone: string;
  country: string;
  nationality: string;
  dateOfBirth?: string;
  churchAffiliation: string;
  currentRole: string;
  yearsInMinistry: number;
  highestAcademicLevel: string;
  desiredProgramId: string;
  desiredProgramName: string;
  schoolId?: string;

  // Ministry details
  ministryPositions: RPLMinistryPosition[];
  competencies: RPLCompetencyItem[];
  evidenceList: RPLEvidenceItem[];
  reflectiveStatements: {
    callingAndPhilosophy: string;
    biblicalTheologicalGrowth: string;
    pastoralLeadershipImpact: string;
    crossCulturalMissions: string;
  };
  references: RPLReference[];
  declarationConfirmed: boolean;
  digitalSignature: string;
  submissionDate: string;

  // Credit calculation & assessment
  requestedCredits: number;
  potentialCreditsEstimated: number;
  approvedCredits: number;
  feeAmountUSD: number;
  feeStatus: 'Unpaid' | 'Pending' | 'Paid' | 'Waived' | 'Refunded';
  paymentReceiptNumber?: string;

  // Workflow & Assessment
  status: RPLStatus;
  progressPercentage: number;
  assessorName?: string;
  assessorId?: string;
  assessorConflictDeclared: boolean;
  assessmentMethodsUsed: RPLAssessmentMethod[];
  assessorNotes?: string;
  assessmentDate?: string;
  interviewScheduledDate?: string;
  interviewNotes?: string;
  interviewResult?: 'Passed' | 'Pending' | 'Needs Follow-Up' | 'Waived';

  // Moderation & Approval
  moderatorName?: string;
  moderationNotes?: string;
  academicDeanApprovalDate?: string;
  transcriptEntryConfirmed: boolean;

  // Appeals & Logs
  appeals: RPLAppeal[];
  auditLogs: RPLAuditLog[];
}

export interface RPLProgramRule {
  programId: string;
  programName: string;
  academicLevel: 'Certificate' | 'Diploma' | 'Bachelor' | 'Master' | 'Doctorate';
  totalProgramCredits: number;
  maxRPLPercentage: number; // e.g. 35% or 45%
  maxRPLCredits: number;
  residencyCreditsRequired: number;
  baseApplicationFeeUSD: number;
  perCreditAssessmentFeeUSD: number;
  eligibleCourses: {
    courseId: string;
    courseCode: string;
    courseTitle: string;
    creditHours: number;
    recommendedMinistryYears: number;
    primaryEvidenceTypes: RPLEvidenceType[];
    assessmentMethod: RPLAssessmentMethod;
  }[];
}

export interface RPLEligibilityResult {
  status: 'Potentially Eligible' | 'Additional Evidence Required' | 'RPL Assessment Recommended' | 'Standard Admission Recommended';
  score: number;
  estimatedCreditsMin: number;
  estimatedCreditsMax: number;
  eligibleCourses: string[];
  recommendations: string[];
  keyStrengths: string[];
}
