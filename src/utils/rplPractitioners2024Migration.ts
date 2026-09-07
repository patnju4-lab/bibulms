import {
  GraduationCeremony,
  GraduationCandidate,
  GraduationBooklet,
  GraduationCertificateRecord
} from '../types/graduation';
import {
  CEREMONY_2024_RPL,
  RPL_2024_CANDIDATES,
  RPL_2024_BOOKLET,
  RPL_2024_CERTIFICATES,
  RAW_RPL_LIST,
  RawRPLCandidateItem
} from '../data/graduationRPL2024Data';

export type { RawRPLCandidateItem };
export { RAW_RPL_LIST };

/**
 * Summary of candidates grouped by their specific affiliate theological institution
 */
export interface InstitutionCohortSummary {
  institutionName: string;
  candidateCount: number;
  maleCount: number;
  femaleCount: number;
  awardLevelsBreakdown: Record<string, number>;
  programs: string[];
  candidates: Array<{
    num: number;
    studentId: string;
    candidateId: string;
    fullName: string;
    gender: 'Male' | 'Female';
    awardLevel: string;
    programName: string;
    academicAchievement?: string;
    certificateNumber: string;
    clearanceProgress: number;
    conferralDate: string;
  }>;
}

/**
 * Audit record for each migrated candidate
 */
export interface MigrationRPLAuditItem {
  num: number;
  studentId: string;
  candidateId: string;
  fullName: string;
  gender: 'Male' | 'Female';
  institution: string;
  programName: string;
  awardLevel: string;
  academicAchievement?: string;
  action: 'inserted' | 'updated' | 'verified';
  certificateNumber: string;
  clearanceStatus: string;
  details: string;
}

/**
 * Complete Migration Execution Report
 */
export interface MigrationRPLReport {
  success: boolean;
  timestamp: string;
  totalProvided: number;
  migratedCandidatesCount: number;
  updatedCandidatesCount: number;
  skippedCount: number;
  institutionsCount: number;
  institutions: InstitutionCohortSummary[];
  ceremonyRegistered: boolean;
  bookletRegistered: boolean;
  certificatesRegisteredCount: number;
  auditTrail: MigrationRPLAuditItem[];
  errors: string[];
}

/**
 * Configuration options for the RPL 2024 migration execution
 */
export interface RPLMigrationOptions {
  /** If true, simulates migration without writing to localStorage or mutating state */
  dryRun?: boolean;
  /** Filter to run migration for specific institutions only */
  targetInstitutions?: string[];
  /** Optional custom candidate records to use instead of default 118 */
  customCandidates?: GraduationCandidate[];
  /** Whether to write results to localStorage (defaults to true) */
  persistToStorage?: boolean;
}

/**
 * Analyzes and categorizes a list of candidates by their respective affiliate institutions
 */
export function categorizeCandidatesByInstitution(
  candidates: GraduationCandidate[] = RPL_2024_CANDIDATES
): InstitutionCohortSummary[] {
  const map = new Map<string, InstitutionCohortSummary>();

  candidates.forEach((cand, idx) => {
    const instName = (cand.institution || 'Breakthrough International Bible University').trim();
    if (!map.has(instName)) {
      map.set(instName, {
        institutionName: instName,
        candidateCount: 0,
        maleCount: 0,
        femaleCount: 0,
        awardLevelsBreakdown: {},
        programs: [],
        candidates: []
      });
    }

    const group = map.get(instName)!;
    group.candidateCount += 1;
    if (cand.gender === 'Female') {
      group.femaleCount += 1;
    } else {
      group.maleCount += 1;
    }

    const award = cand.awardLevel || 'Certificate';
    group.awardLevelsBreakdown[award] = (group.awardLevelsBreakdown[award] || 0) + 1;

    if (cand.programName && !group.programs.includes(cand.programName)) {
      group.programs.push(cand.programName);
    }

    // Extract sequence number from ID or loop index
    const numMatch = cand.id.match(/\d+$/);
    const num = numMatch ? parseInt(numMatch[0], 10) : idx + 1;

    group.candidates.push({
      num,
      studentId: cand.studentId,
      candidateId: cand.id,
      fullName: cand.fullName,
      gender: cand.gender,
      awardLevel: cand.awardLevel,
      programName: cand.programName,
      academicAchievement: cand.academicAchievement,
      certificateNumber: cand.certificateNumber || `BIBU-CERT-RPL-2024-${String(num).padStart(3, '0')}`,
      clearanceProgress: cand.clearanceProgress || 100,
      conferralDate: cand.conferralDate || '2024-09-28'
    });
  });

  // Sort descending by candidate count, then alphabetically
  return Array.from(map.values()).sort((a, b) => {
    if (b.candidateCount !== a.candidateCount) {
      return b.candidateCount - a.candidateCount;
    }
    return a.institutionName.localeCompare(b.institutionName);
  });
}

/**
 * Primary Data Migration & Persistence Function:
 * Persists the 118 student records for the 'RPL Practitioners Graduation 2024'
 * into the graduation database (candidates, ceremonies, booklets, certificates),
 * categorized by their respective institutions.
 */
export function migrateRPL2024Practitioners(
  options: RPLMigrationOptions = {}
): MigrationRPLReport {
  const isDryRun = !!options.dryRun;
  const shouldPersist = options.persistToStorage !== false && !isDryRun;
  const errors: string[] = [];
  const auditTrail: MigrationRPLAuditItem[] = [];

  // 1. Resolve source candidates
  let sourceCandidates: GraduationCandidate[] = options.customCandidates || RPL_2024_CANDIDATES;

  if (options.targetInstitutions && options.targetInstitutions.length > 0) {
    const filterSet = new Set(options.targetInstitutions.map(i => i.toLowerCase().trim()));
    sourceCandidates = sourceCandidates.filter(c => 
      c.institution && filterSet.has(c.institution.toLowerCase().trim())
    );
  }

  // 2. Load existing candidate database from localStorage if in browser environment
  let existingCandidates: GraduationCandidate[] = [];
  let existingCeremonies: GraduationCeremony[] = [];
  let existingBooklets: GraduationBooklet[] = [];
  let existingCertificates: GraduationCertificateRecord[] = [];

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const savedCand = window.localStorage.getItem('bibu_graduation_candidates');
      if (savedCand) {
        existingCandidates = JSON.parse(savedCand);
      }
    } catch (e) {
      errors.push(`Notice: Could not parse stored candidates: ${String(e)}`);
    }

    try {
      const savedCerem = window.localStorage.getItem('bibu_graduation_ceremonies');
      if (savedCerem) {
        existingCeremonies = JSON.parse(savedCerem);
      }
    } catch (e) {
      errors.push(`Notice: Could not parse stored ceremonies: ${String(e)}`);
    }

    try {
      const savedBook = window.localStorage.getItem('bibu_graduation_booklets');
      if (savedBook) {
        existingBooklets = JSON.parse(savedBook);
      }
    } catch (e) {
      errors.push(`Notice: Could not parse stored booklets: ${String(e)}`);
    }

    try {
      const savedCert = window.localStorage.getItem('bibu_graduation_certificates');
      if (savedCert) {
        existingCertificates = JSON.parse(savedCert);
      }
    } catch (e) {
      errors.push(`Notice: Could not parse stored certificates: ${String(e)}`);
    }
  }

  let migratedCandidatesCount = 0;
  let updatedCandidatesCount = 0;

  // 3. Process candidate records
  const candidateMap = new Map<string, GraduationCandidate>();
  existingCandidates.forEach(c => candidateMap.set(c.id, c));

  sourceCandidates.forEach((cand, idx) => {
    const numMatch = cand.id.match(/\d+$/);
    const num = numMatch ? parseInt(numMatch[0], 10) : idx + 1;
    const isExisting = candidateMap.has(cand.id);

    // Normalize and ensure full clearance & conferral integrity
    const normalizedCandidate: GraduationCandidate = {
      ...cand,
      ceremonyId: 'ceremony-2024-rpl-practitioners',
      ceremonyNumber: 'RPL Practitioners Graduation 2024',
      status: 'Conferred Graduate',
      clearanceProgress: 100,
      graduationFeeStatus: 'Paid',
      graduationFeeAmount: 200,
      graduationFeePaid: 200,
      isAlumniMigrated: true,
      conferralDate: '2024-09-28'
    };

    candidateMap.set(cand.id, normalizedCandidate);

    if (isExisting) {
      updatedCandidatesCount++;
    } else {
      migratedCandidatesCount++;
    }

    auditTrail.push({
      num,
      studentId: cand.studentId,
      candidateId: cand.id,
      fullName: cand.fullName,
      gender: cand.gender,
      institution: cand.institution || 'Breakthrough International Bible University',
      programName: cand.programName,
      awardLevel: cand.awardLevel,
      academicAchievement: cand.academicAchievement,
      action: isExisting ? 'updated' : 'inserted',
      certificateNumber: cand.certificateNumber || `BIBU-CERT-RPL-2024-${String(num).padStart(3, '0')}`,
      clearanceStatus: '100% Cleared (All 7 Departments Approved)',
      details: `Conferred ${cand.awardLevel} via RPL under ${cand.institution || 'BIBU'}`
    });
  });

  const finalCandidatesList = Array.from(candidateMap.values());

  // 4. Ensure Ceremony Record is present & up to date
  const ceremonyMap = new Map<string, GraduationCeremony>();
  existingCeremonies.forEach(c => ceremonyMap.set(c.id, c));
  ceremonyMap.set(CEREMONY_2024_RPL.id, CEREMONY_2024_RPL);
  const finalCeremoniesList = Array.from(ceremonyMap.values());

  // 5. Ensure Convocation Booklet is present & up to date
  const bookletMap = new Map<string, GraduationBooklet>();
  existingBooklets.forEach(b => bookletMap.set(b.id, b));
  bookletMap.set(RPL_2024_BOOKLET.id, RPL_2024_BOOKLET);
  const finalBookletsList = Array.from(bookletMap.values());

  // 6. Ensure Certificates are present & up to date
  const certMap = new Map<string, GraduationCertificateRecord>();
  existingCertificates.forEach(c => certMap.set(c.id, c));
  RPL_2024_CERTIFICATES.forEach(cert => certMap.set(cert.id, cert));
  const finalCertificatesList = Array.from(certMap.values());

  // 7. Categorize by institution
  const institutionsSummary = categorizeCandidatesByInstitution(sourceCandidates);

  // 8. Commit to localStorage if persistence requested
  if (shouldPersist && typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem('bibu_graduation_candidates', JSON.stringify(finalCandidatesList));
      window.localStorage.setItem('bibu_graduation_ceremonies', JSON.stringify(finalCeremoniesList));
      window.localStorage.setItem('bibu_graduation_booklets', JSON.stringify(finalBookletsList));
      window.localStorage.setItem('bibu_graduation_certificates', JSON.stringify(finalCertificatesList));
      
      // Store migration execution log timestamp
      const migrationLog = {
        migrationKey: 'rpl_practitioners_2024',
        timestamp: new Date().toISOString(),
        totalGraduands: sourceCandidates.length,
        institutionsCount: institutionsSummary.length,
        status: 'COMPLETED'
      };
      window.localStorage.setItem('bibu_migration_rpl_2024_last_run', JSON.stringify(migrationLog));
    } catch (err) {
      errors.push(`Storage Warning: Failed writing to localStorage: ${String(err)}`);
    }
  }

  return {
    success: errors.length === 0,
    timestamp: new Date().toISOString(),
    totalProvided: sourceCandidates.length,
    migratedCandidatesCount,
    updatedCandidatesCount,
    skippedCount: 0,
    institutionsCount: institutionsSummary.length,
    institutions: institutionsSummary,
    ceremonyRegistered: true,
    bookletRegistered: true,
    certificatesRegisteredCount: RPL_2024_CERTIFICATES.length,
    auditTrail,
    errors
  };
}

/**
 * Generate CSV representation of all 118 RPL graduands categorized by institution
 */
export function generateRPLInstitutionsCSV(
  candidates: GraduationCandidate[] = RPL_2024_CANDIDATES
): string {
  const headers = [
    'Serial No',
    'Student ID',
    'Full Name',
    'Gender',
    'Affiliate Institution',
    'Award Level',
    'Program Name',
    'Academic Achievement',
    'Clearance Status',
    'Clearance Progress (%)',
    'Certificate Number',
    'Conferral Date'
  ];

  const categorized = categorizeCandidatesByInstitution(candidates);
  const rows: string[] = [headers.join(',')];

  categorized.forEach(instGroup => {
    // Add institution header row as separator
    rows.push(`"", "", "--- [INSTITUTION: ${instGroup.institutionName.replace(/"/g, '""')} (${instGroup.candidateCount} Graduands)] ---", "", "", "", "", "", "", "", "", ""`);

    instGroup.candidates.forEach(c => {
      const row = [
        `"${c.num}"`,
        `"${c.studentId}"`,
        `"${c.fullName.replace(/"/g, '""')}"`,
        `"${c.gender}"`,
        `"${instGroup.institutionName.replace(/"/g, '""')}"`,
        `"${c.awardLevel}"`,
        `"${c.programName.replace(/"/g, '""')}"`,
        `"${(c.academicAchievement || '').replace(/"/g, '""')}"`,
        `"Completed (100%)"`,
        `"${c.clearanceProgress}"`,
        `"${c.certificateNumber}"`,
        `"${c.conferralDate}"`
      ];
      rows.push(row.join(','));
    });
  });

  return rows.join('\n');
}

/**
 * Helper to trigger client-side download of the CSV export
 */
export function downloadRPLInstitutionsCSV(
  candidates: GraduationCandidate[] = RPL_2024_CANDIDATES,
  filename: string = 'BIBU_RPL_2024_Graduation_Institution_Registry.csv'
) {
  if (typeof window === 'undefined') return;
  const csvContent = generateRPLInstitutionsCSV(candidates);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
