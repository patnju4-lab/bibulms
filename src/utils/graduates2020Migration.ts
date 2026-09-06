import { Alumni, AlumniQualificationLevel } from '../types/alumni';
import { RAW_2020_GRADUATES, Raw2020GraduateRecord } from '../data/rawGraduates2020';

export type { Raw2020GraduateRecord };
export { RAW_2020_GRADUATES };

/**
 * Standard phone formatting for international cohort
 */
export function format2020PhoneNumber(rawPhone: string, country: string = 'Kenya'): string {
  if (!rawPhone) return '';
  const trimmed = rawPhone.trim();
  const digitsOnly = trimmed.replace(/\D/g, '');

  if (country === 'Tanzania') {
    if (digitsOnly.startsWith('255') && digitsOnly.length >= 12) {
      return `+255 ${digitsOnly.slice(3, 6)} ${digitsOnly.slice(6, 9)} ${digitsOnly.slice(9)}`;
    }
    if (trimmed.startsWith('+')) return trimmed;
    return `+255 ${trimmed}`;
  }

  if (country === 'Zimbabwe') {
    if (digitsOnly.startsWith('263') && digitsOnly.length >= 12) {
      return `+263 ${digitsOnly.slice(3, 6)} ${digitsOnly.slice(6, 9)} ${digitsOnly.slice(9)}`;
    }
    if (trimmed.startsWith('+')) return trimmed;
    return `+263 ${trimmed}`;
  }

  if (country === 'Ethiopia') {
    if (digitsOnly.startsWith('251') && digitsOnly.length >= 12) {
      return `+251 ${digitsOnly.slice(3, 6)} ${digitsOnly.slice(6, 9)} ${digitsOnly.slice(9)}`;
    }
    if (trimmed.startsWith('+')) return trimmed;
    return `+251 ${trimmed}`;
  }

  if (country === 'Haiti') {
    if (digitsOnly.startsWith('509') && digitsOnly.length >= 11) {
      return `+509 ${digitsOnly.slice(3, 7)} ${digitsOnly.slice(7)}`;
    }
    if (trimmed.startsWith('+')) return trimmed;
    return `+509 ${trimmed}`;
  }

  // Default Kenya
  if (digitsOnly.startsWith('254') && digitsOnly.length === 12) {
    return `+254 ${digitsOnly.slice(3, 6)} ${digitsOnly.slice(6, 9)} ${digitsOnly.slice(9)}`;
  }
  if (digitsOnly.startsWith('0') && digitsOnly.length === 10) {
    return `+254 ${digitsOnly.slice(1, 4)} ${digitsOnly.slice(4, 7)} ${digitsOnly.slice(7)}`;
  }
  if (trimmed.startsWith('+')) return trimmed;
  return `+254 ${trimmed}`;
}

/**
 * Parses raw name into proper name parts with appropriate academic/ecclesiastical honorific
 */
export function parse2020NameParts(
  rawName: string,
  qualificationLevel: string = 'Bachelor'
): {
  honorific: string;
  firstName: string;
  middleName: string;
  lastName: string;
  displayName: string;
} {
  const clean = rawName.trim().replace(/\s+/g, ' ');
  const parts = clean.split(' ');

  let honorific = '';
  const isDoctorate =
    qualificationLevel.toLowerCase().includes('doctor') ||
    qualificationLevel.toLowerCase().includes('phd');

  if (parts[0]?.toLowerCase() === 'apostle') {
    honorific = isDoctorate ? 'Apostle Dr.' : 'Apostle';
    parts.shift();
    if (parts[0]?.toLowerCase().startsWith('dr')) parts.shift();
  } else if (parts[0]?.toLowerCase() === 'bishop') {
    honorific = isDoctorate ? 'Bishop Dr.' : 'Bishop';
    parts.shift();
    if (parts[0]?.toLowerCase().startsWith('dr')) parts.shift();
  } else if (parts[0]?.toLowerCase() === 'ven' || parts[0]?.toLowerCase() === 'venerable') {
    honorific = isDoctorate ? 'Ven. Dr.' : 'Ven.';
    parts.shift();
  } else if (parts[0]?.toLowerCase() === 'prof' || parts[0]?.toLowerCase() === 'prof.') {
    honorific = 'Prof. Dr.';
    parts.shift();
    if (parts[0]?.toLowerCase().startsWith('dr')) parts.shift();
  } else if (parts[0]?.toLowerCase() === 'rev' || parts[0]?.toLowerCase() === 'rev.') {
    honorific = isDoctorate ? 'Rev. Dr.' : 'Rev.';
    parts.shift();
  } else if (parts[0]?.toLowerCase() === 'pastor' || parts[0]?.toLowerCase() === 'pst') {
    honorific = isDoctorate ? 'Pastor Dr.' : 'Pastor';
    parts.shift();
  } else if (isDoctorate) {
    honorific = 'Dr.';
    if (parts[0]?.toLowerCase().startsWith('dr')) parts.shift();
  }

  let firstName = '';
  let middleName = '';
  let lastName = '';

  if (parts.length === 1) {
    firstName = parts[0];
    lastName = parts[0];
  } else if (parts.length === 2) {
    firstName = parts[0];
    lastName = parts[1];
  } else if (parts.length === 3) {
    firstName = parts[0];
    middleName = parts[1];
    lastName = parts[2];
  } else {
    firstName = parts[0];
    middleName = parts.slice(1, -1).join(' ');
    lastName = parts[parts.length - 1];
  }

  // Format capitalized properly
  const formatWord = (w: string) =>
    w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : '';

  firstName = formatWord(firstName);
  middleName = middleName.split(' ').map(formatWord).join(' ');
  lastName = formatWord(lastName);

  const displayName = honorific
    ? `${honorific} ${firstName}${middleName ? ' ' + middleName : ''} ${lastName}`
    : `${firstName}${middleName ? ' ' + middleName : ''} ${lastName}`;

  return {
    honorific,
    firstName,
    middleName,
    lastName,
    displayName,
  };
}

/**
 * Maps raw 2020 graduate to official BIBU Alumni entity
 */
export function map2020GraduateToAlumni(
  raw: Raw2020GraduateRecord,
  index: number = 0
): Alumni {
  const nameData = parse2020NameParts(raw.name, raw.qualificationLevel);
  const formattedPhone = format2020PhoneNumber(raw.mobile, raw.country);
  const regNo = (raw.regNo || '').trim();
  const gradYear = Number(raw.graduationYear) || 2020;

  const paddedIndex = String(index + 1).padStart(3, '0');
  const alumniId = `BIBU-ALM-2020-${paddedIndex}`;
  const certificateNumber = `BIBU-CERT-2020-${paddedIndex}`;
  const uniqueId = `alm-conv-2020-${paddedIndex}`;

  // Map country code
  let countryCode = 'KE';
  if (raw.country === 'Tanzania') countryCode = 'TZ';
  else if (raw.country === 'Zimbabwe') countryCode = 'ZW';
  else if (raw.country === 'Ethiopia') countryCode = 'ET';
  else if (raw.country === 'Haiti') countryCode = 'HT';

  // Map primary city
  let city = 'Nairobi';
  if (raw.country === 'Tanzania') city = 'Moshi / Arusha';
  else if (raw.country === 'Zimbabwe') city = 'Harare';
  else if (raw.country === 'Ethiopia') city = 'Addis Ababa';
  else if (raw.country === 'Haiti') city = 'Port-au-Prince';
  else if (raw.county?.includes('Nakuru')) city = 'Nakuru';
  else if (raw.county?.includes('Narok')) city = 'Narok';
  else if (raw.county?.includes('Kajiado')) city = 'Kajiado';
  else if (raw.county?.includes('Laikipia')) city = 'Nanyuki';
  else if (raw.county?.includes('Kirinyaga')) city = 'Kerugoya';
  else if (raw.county?.includes('Makueni')) city = 'Wote';
  else if (raw.county?.includes('Machakos')) city = 'Machakos';
  else if (raw.county?.includes('Kitui')) city = 'Kitui';
  else if (raw.county?.includes('Nyandarua')) city = 'Ol Kalou';

  // Normalize qualification level
  let qualLevel: AlumniQualificationLevel = 'Bachelor';
  const ql = (raw.qualificationLevel || '').toLowerCase();
  if (ql.includes('honorary')) qualLevel = 'Honorary Doctorate';
  else if (ql.includes('phd') || ql.includes('doctor')) qualLevel = 'Doctorate';
  else if (ql.includes('master')) qualLevel = 'Master';
  else if (ql.includes('bachelor')) qualLevel = 'Bachelor';
  else if (ql.includes('higher diploma')) qualLevel = 'Higher Diploma' as AlumniQualificationLevel;
  else if (ql.includes('diploma')) qualLevel = 'Diploma';
  else if (ql.includes('certificate')) qualLevel = 'Certificate';

  const isDistinguished =
    qualLevel === 'Honorary Doctorate' ||
    qualLevel === 'Doctorate' ||
    qualLevel === 'Master';

  return {
    id: uniqueId,
    alumni_id: alumniId,
    student_id: regNo,
    certificate_number: certificateNumber,
    first_name: nameData.firstName,
    middle_name: nameData.middleName,
    last_name: nameData.lastName,
    full_name: nameData.displayName,
    country: raw.country || 'Kenya',
    country_code: countryCode,
    city: city,
    email: (raw.email || '').trim().toLowerCase(),
    phone: formattedPhone,
    graduation_year: gradYear,
    graduation_date: raw.graduationDate || '2020-12-04',
    program_id: `prog-2020-${paddedIndex}`,
    program_name: raw.programName,
    qualification_level: qualLevel,
    campus: raw.campus || 'Breakthrough International Bible University Convocation Assembly',
    study_mode: 'On-Campus Resident',
    current_position: `${raw.programName} Graduate`,
    organization: raw.campus,
    profession: 'Christian Ministry, Counseling & Theology',
    ministry: raw.supervisor ? `Supervised by ${raw.supervisor}` : 'Church Leadership & Pastoral Outreach',
    biography: `Graduated with ${raw.programName} at the Breakthrough International Bible University Global Convocation on Friday, December 4, 2020 (${raw.campus}, ${raw.country}).`,
    achievements: [
      `Conferred ${raw.programName} (Class of 2020)`,
      `Registered Under Registration Number: ${regNo}`,
      `Breakthrough International Bible University Official Convocation Roll`
    ],
    chapter_id: `ch-${countryCode.toLowerCase()}-alumni`,
    verification_status: 'Verified Alumni',
    privacy_status: 'Public Profile',
    featured: index < 15 || qualLevel === 'Honorary Doctorate',
    distinguished: isDistinguished,
    distinguished_category: qualLevel === 'Honorary Doctorate' ? 'Ministry Leadership' : 'Theology',
    is_demo: false,
    created_at: '2020-12-04T10:00:00Z',
    updated_at: new Date().toISOString(),

    // CamelCase aliases
    alumniId,
    studentId: regNo,
    certificateNumber,
    firstName: nameData.firstName,
    middleName: nameData.middleName,
    lastName: nameData.lastName,
    fullName: nameData.displayName,
    countryCode,
    graduationYear: gradYear,
    graduationDate: raw.graduationDate || '2020-12-04',
    programName: raw.programName,
    qualificationLevel: qualLevel,
    studyMode: 'On-Campus Resident',
    currentPosition: `${raw.programName} Graduate`,
    verificationStatus: 'Verified Alumni',
    privacyStatus: 'Public Profile',
    isDemo: false,
    createdAt: '2020-12-04T10:00:00Z',
    updatedAt: new Date().toISOString(),
  };
}

export interface Migration2020AuditItem {
  regNo: string;
  fullName: string;
  email: string;
  mobile: string;
  graduationYear: number;
  programName: string;
  campus: string;
  country: string;
  alumniId: string;
  certificateNumber: string;
  action: 'inserted' | 'updated' | 'verified';
  details: string;
}

export interface Migration2020Report {
  success: boolean;
  timestamp: string;
  totalProvided: number;
  migratedCount: number;
  updatedCount: number;
  skippedCount: number;
  migratedRecords: Alumni[];
  auditTrail: Migration2020AuditItem[];
  errors: string[];
}

export interface Migration2020Options {
  /** Optional custom raw records; if omitted, defaults to the official 669 2020 graduates */
  rawRecords?: Raw2020GraduateRecord[];
  /** Existing alumni array to merge into */
  existingDatabase?: Alumni[];
  /** If true, will not commit changes to localStorage */
  dryRun?: boolean;
}

/**
 * Core Data Migration Function: Bulk-imports the 2020 graduates provided in the request
 * into the alumni database, ensuring all required fields (Name, Mobile, Email, Reg No, Graduation Year)
 * are mapped correctly.
 */
export function migrate2020Graduates(options: Migration2020Options = {}): Migration2020Report {
  const sourceRecords =
    options.rawRecords && options.rawRecords.length > 0
      ? options.rawRecords
      : RAW_2020_GRADUATES;

  const errors: string[] = [];
  const auditTrail: Migration2020AuditItem[] = [];
  const migratedRecords: Alumni[] = [];

  // Determine existing database
  let db: Alumni[] = [];
  if (options.existingDatabase && options.existingDatabase.length > 0) {
    db = [...options.existingDatabase];
  } else if (typeof window !== 'undefined' && window.localStorage) {
    const saved = window.localStorage.getItem('bibu_alumni_database');
    if (saved) {
      try {
        db = JSON.parse(saved);
      } catch (e) {
        errors.push(`Failed to parse existing localStorage database: ${String(e)}`);
      }
    }
  }

  let insertedCount = 0;
  let updatedCount = 0;

  sourceRecords.forEach((raw, idx) => {
    try {
      // Validate mandatory fields: Name, Mobile, Email, Reg No, Graduation Year
      if (!raw.name?.trim()) {
        errors.push(`Row ${idx + 1}: Missing required field 'Name'`);
        return;
      }
      if (!raw.regNo?.trim()) {
        errors.push(`Row ${idx + 1} (${raw.name}): Missing required field 'Reg No'`);
        return;
      }
      if (!raw.mobile?.trim()) {
        errors.push(`Row ${idx + 1} (${raw.name}): Missing required field 'Mobile'`);
        return;
      }
      if (!raw.email?.trim()) {
        errors.push(`Row ${idx + 1} (${raw.name}): Missing required field 'Email'`);
        return;
      }
      const gradYear = Number(raw.graduationYear) || 2020;
      if (gradYear !== 2020) {
        errors.push(`Row ${idx + 1} (${raw.name}): Graduation year is ${gradYear}, expected 2020`);
      }

      // Map raw record to standard Alumni entity
      const alumniEntity = map2020GraduateToAlumni(raw, idx);
      migratedRecords.push(alumniEntity);

      // Deduplicate by student_id (Reg No), email, alumni_id, or id
      const existingIdx = db.findIndex(
        (a) =>
          (a.student_id && a.student_id.toLowerCase() === alumniEntity.student_id.toLowerCase()) ||
          (a.studentId && a.studentId.toLowerCase() === alumniEntity.student_id.toLowerCase()) ||
          (a.email && a.email.toLowerCase() === alumniEntity.email.toLowerCase()) ||
          a.id === alumniEntity.id ||
          a.alumni_id === alumniEntity.alumni_id
      );

      if (existingIdx >= 0) {
        // Update existing record
        db[existingIdx] = {
          ...db[existingIdx],
          ...alumniEntity,
          updated_at: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        updatedCount++;
        auditTrail.push({
          regNo: alumniEntity.student_id,
          fullName: alumniEntity.full_name,
          email: alumniEntity.email,
          mobile: alumniEntity.phone || '',
          graduationYear: alumniEntity.graduation_year,
          programName: alumniEntity.program_name,
          campus: alumniEntity.campus || '',
          country: alumniEntity.country,
          alumniId: alumniEntity.alumni_id,
          certificateNumber: alumniEntity.certificate_number || '',
          action: 'updated',
          details: `Updated verified Class of 2020 record for ${alumniEntity.full_name} (${alumniEntity.student_id})`,
        });
      } else {
        // Insert new record
        db.push(alumniEntity);
        insertedCount++;
        auditTrail.push({
          regNo: alumniEntity.student_id,
          fullName: alumniEntity.full_name,
          email: alumniEntity.email,
          mobile: alumniEntity.phone || '',
          graduationYear: alumniEntity.graduation_year,
          programName: alumniEntity.program_name,
          campus: alumniEntity.campus || '',
          country: alumniEntity.country,
          alumniId: alumniEntity.alumni_id,
          certificateNumber: alumniEntity.certificate_number || '',
          action: 'inserted',
          details: `Conferred & imported verified record for ${alumniEntity.full_name} (${alumniEntity.student_id})`,
        });
      }
    } catch (err) {
      errors.push(`Row ${idx + 1} (${raw.name}): Processing exception - ${String(err)}`);
    }
  });

  // Persist to localStorage if in browser environment and not dryRun
  if (!options.dryRun && typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem('bibu_alumni_database', JSON.stringify(db));
    } catch (e) {
      errors.push(`Failed to commit database to localStorage: ${String(e)}`);
    }
  }

  return {
    success: errors.length === 0,
    timestamp: new Date().toISOString(),
    totalProvided: sourceRecords.length,
    migratedCount: insertedCount,
    updatedCount: updatedCount,
    skippedCount: sourceRecords.length - (insertedCount + updatedCount),
    migratedRecords,
    auditTrail,
    errors,
  };
}

/**
 * Generates standard CSV export for the 2020 Graduates
 */
export function export2020GraduatesToCsv(records: Raw2020GraduateRecord[] = RAW_2020_GRADUATES): string {
  const headers = [
    'Name',
    'Mobile',
    'Email',
    'Reg No',
    'Graduation Year',
    'Program Name',
    'Qualification Level',
    'Campus',
    'County',
    'Country',
    'Supervisor'
  ];

  const escapeCsv = (str: string | undefined | null) => {
    if (!str) return '""';
    const clean = String(str).replace(/"/g, '""');
    return `"${clean}"`;
  };

  const rows = records.map((r) => [
    escapeCsv(r.name),
    escapeCsv(r.mobile),
    escapeCsv(r.email),
    escapeCsv(r.regNo),
    escapeCsv(String(r.graduationYear)),
    escapeCsv(r.programName),
    escapeCsv(r.qualificationLevel),
    escapeCsv(r.campus),
    escapeCsv(r.county),
    escapeCsv(r.country),
    escapeCsv(r.supervisor)
  ].join(','));

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Data migration function to bulk-import the 2020 graduates provided in the request
 * into the alumni database, ensuring all required fields (Name, Mobile, Email, Reg No, Graduation Year)
 * are mapped correctly.
 */
export const bulkImport2020Graduates = migrate2020Graduates;

