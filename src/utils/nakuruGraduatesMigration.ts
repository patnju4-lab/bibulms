import { Alumni } from '../types/alumni';

export interface RawNakuruGraduateRecord {
  name: string;
  mobile: string;
  email: string;
  regNo: string;
  graduationYear?: number | string;
  campus?: string;
  role?: string;
  ministry?: string;
  profession?: string;
  city?: string;
  country?: string;
}

/**
 * Raw verified dataset of the 2022 Nakuru Mother's Chapter Honorary Doctorate Cohort
 * Conferred at the Convocation Assembly on April 8, 2022 in Nakuru, Kenya.
 */
export const RAW_NAKURU_2022_GRADUATES: RawNakuruGraduateRecord[] = [
  { name: 'Nancy Njeri Gitau', mobile: '0722 646 553', email: 'nancyngke@yahoo.com', regNo: 'BTS/20394/2021', graduationYear: 2022, role: 'Chapter Leader & Conferred Alumna', ministry: "Women's Ministry, Evangelism & Apostolic Outreach" },
  { name: 'Hellen Wanjeri Musyoka', mobile: '0727 118 167', email: 'hellenwa63@gmail.com', regNo: 'BTS/20395/2021', graduationYear: 2022, role: 'Doctoral Conferred Alumna', ministry: "Pastoral Support, Prayer Ministry & Community Outreach" },
  { name: 'Esther Njeri Matara', mobile: '0711 606 990', email: 'essiehkato@gmail.com', regNo: 'BTS/20396/2021', graduationYear: 2022, role: 'Doctoral Conferred Alumna', ministry: "Evangelism & Community Development" },
  { name: 'Gladys Nabusandu Wekesa', mobile: '0724 750 169', email: 'ebenezam@gmail.com', regNo: 'BTS/20397/2021', graduationYear: 2022, role: 'Doctoral Conferred Alumna', ministry: "Women's Empowerment & Gospel Outreach" },
  { name: 'Violet Waithira Gitonga', mobile: '0717 057 363', email: 'mumviola@gmail.com', regNo: 'BTS/20398/2021', graduationYear: 2022, role: 'Doctoral Conferred Alumna', ministry: "Mothers Fellowship & Youth Mentorship" },
  { name: 'Jane Wambui Gidraph', mobile: '0722 588 786', email: 'sisterskeeper00@gmail.com', regNo: 'BTS/20399/2021', graduationYear: 2022, role: "Doctoral Conferred Alumna & Founder, Sister's Keeper", ministry: "Sisters Keeper Fellowship & Orphan Care" },
  { name: 'Judy Nyambura Maina', mobile: '0718 856 659', email: 'judyrestoration4@gmail.com', regNo: 'BTS/20400/2021', graduationYear: 2022, role: 'Doctoral Conferred Alumna & Restoration Minister', ministry: "Restoration & Counseling Outreach" },
  { name: 'Esther Wangari Mungai', mobile: '0725 137 169', email: 'esthermungai999@gmail.com', regNo: 'BTS/20401/2021', graduationYear: 2022, role: 'Doctoral Conferred Alumna', ministry: "Women's Spiritual Growth & Evangelism" },
  { name: 'Nancy Mwembu Kinuthia', mobile: '0725 988 516', email: 'nancykinuthia@gmail.com', regNo: 'BTS/20402/2021', graduationYear: 2022, role: 'Doctoral Conferred Alumna', ministry: "Church Fellowship & Women's Discipleship" },
  { name: 'Hilda Wanjiru Kungu', mobile: '0720 804 879', email: 'hildakungu17@gmail.com', regNo: 'BTS/20403/2021', graduationYear: 2022, role: 'Doctoral Conferred Alumna', ministry: "Pastoral Care & Community Welfare" },
  { name: 'Julia Nyambura', mobile: '0700 900 100', email: 'judykabura@gmail.com', regNo: 'BTS/20404/2021', graduationYear: 2022, role: 'Doctoral Conferred Alumna', ministry: "Women's Ministry & Intercession" },
  { name: 'Mary Wanjiru Mwangi', mobile: '0725 823 275', email: 'marywanjiru057@gmail.com', regNo: 'BTS/20405/2021', graduationYear: 2022, role: 'Doctoral Conferred Alumna', ministry: "Hospitality & Family Ministry" },
  { name: 'Joseph Kanyiri Kuria', mobile: '0724 810 506', email: 'mispara08@gmail.com', regNo: 'BTS/20406/2021', graduationYear: 2022, role: 'Doctoral Conferred Alumnus & Ministerial Leader', ministry: "Church Leadership & Evangelism" },
  { name: 'Dorcas Waithera Osongo', mobile: '0727 979 297', email: 'dorcasosongo@gmail.com', regNo: 'BTS/20407/2021', graduationYear: 2022, role: 'Doctoral Conferred Alumna', ministry: "Dorcas Ministry, Widow Welfare & Community Care" },
  { name: 'Eunice Njeri Njuguna', mobile: '0726 138 108', email: 'mukurianjeri@gmail.com', regNo: 'BTS/20408/2021', graduationYear: 2022, role: 'Doctoral Conferred Alumna', ministry: "Women's Ministry & Community Welfare" },
  { name: 'Jane Wambui Njuguna', mobile: '0722 927 089', email: 'wambuijane590@gmail.com', regNo: 'BTS/20409/2021', graduationYear: 2022, role: 'Doctoral Conferred Alumna', ministry: "Intercession & Community Empowerment" },
  { name: 'Merisah K. Luvala', mobile: '0727 705 248', email: 'merisaluvala@gmail.com', regNo: 'BTS/2041O/2021', graduationYear: 2022, role: 'Doctoral Conferred Alumna', ministry: "Theological Education & Mentorship" },
  { name: 'Cecilia Wahito Mwangi', mobile: '0722 692 776', email: 'ceciliawahito17@gmail.com', regNo: 'BTS/20411/2021', graduationYear: 2022, role: 'Doctoral Conferred Alumna', ministry: "Family Counseling & Women's Ministry" },
  { name: 'Pauline Wanjiru Mwangi', mobile: '0716 896 649', email: 'paupauwanji@gmail.com', regNo: 'BTS/20412/2021', graduationYear: 2022, role: 'Doctoral Conferred Alumna', ministry: "Youth Mentorship & Women's Fellowship" },
  { name: 'Margaret Nyambura Karanja', mobile: '0724 161 661', email: 'karanjamargaret02@gmail.com', regNo: 'BTS/20413/2021', graduationYear: 2022, role: 'Doctoral Conferred Alumna', ministry: "Praise, Worship & Women's Outreach" },
  { name: 'Beatrice Wangui Mwangi', mobile: '0707 282 771', email: 'mwangibbeatrice20@gmail.com', regNo: 'BTS/20414/2021', graduationYear: 2022, role: 'Doctoral Conferred Alumna', ministry: "Women's Ministry & Community Benevolence" },
  { name: 'Anne N. Gikonyo', mobile: '0722 388 623', email: 'annegiks96@gmail.com', regNo: 'BTS/20415/2021', graduationYear: 2022, role: 'Doctoral Conferred Alumna', ministry: "Women's Discipleship & Intercessory Prayer" },
  { name: 'Agne Mwende', mobile: '0721 296 903', email: 'agnesmwendesa@gmail.com', regNo: 'BTS/20416/2021', graduationYear: 2022, role: 'Doctoral Conferred Alumna', ministry: "Evangelism & Community Care" },
  { name: 'Zipporah Njeri Mbugua', mobile: '0720 435 382', email: 'zipporahmbuguaj@gmail.com', regNo: 'BTS/20417/2021', graduationYear: 2022, role: 'Doctoral Conferred Alumna', ministry: "Prayer Ministry & Women's Leadership" },
  { name: 'Irene Njeri Nzuki', mobile: '0721 248 859', email: 'nzukiirene183@gmail.com', regNo: 'BTS/20418/2021', graduationYear: 2022, role: 'Doctoral Conferred Alumna', ministry: "Family Counseling & Women's Fellowship" },
  { name: 'Dominic Kimani Njenga', mobile: '0723 706 857', email: 'domkim22@gmail.com', regNo: 'BTS/20419/2021', graduationYear: 2022, role: 'Doctoral Conferred Alumnus & Ministerial Leader', ministry: "Church Planting & Pastoral Care" },
  { name: 'Joy Mwende Nzuki', mobile: '0757 797 482', email: 'nzukijoy@gmail.com', regNo: 'BTS/20420/2021', graduationYear: 2022, role: 'Doctoral Conferred Alumna', ministry: "Youth Ministry & Women's Fellowship" },
  { name: 'Margaret Wambui Ngari', mobile: '0725 682 914', email: 'margaretngari542@gmail.com', regNo: 'BTS/20421/2021', graduationYear: 2022, role: 'Doctoral Conferred Alumna', ministry: "Women's Ministry & Community Outreach" },
  { name: 'Hannah Watiri Njuguna', mobile: '0720 490 149', email: 'hannahnjuguna52@gmail.com', regNo: 'BTS/20422/2021', graduationYear: 2022, role: 'Doctoral Conferred Alumna', ministry: "Intercessory Prayer & Women's Mentoring" },
  { name: 'George Mwangi Kariuki', mobile: '0728 568 285', email: 'pawamwa620@gmail.com', regNo: 'BTS/20423/2021', graduationYear: 2022, role: 'Doctoral Conferred Alumnus & Ministerial Leader', ministry: "Evangelism, Men of Faith & Community Welfare" },
  { name: 'Milkah Nafula Kalest', mobile: '0721 449 285', email: 'apostlemilkah@gmail.com', regNo: 'BTS/20424/2021', graduationYear: 2022, role: 'Doctoral Conferred Alumna & Apostolic Overseer', ministry: "Apostolic Oversight, Women's Empowerment & Deliverance Ministry" },
  { name: 'Maxine Njoki Ikaari', mobile: '0720 912 162', email: 'maxinenjoki@yahoo.com', regNo: 'BTS/20425/2021', graduationYear: 2022, role: 'Doctoral Conferred Alumna', ministry: "Family Life, Women's Mentorship & Community Outreach" },
];

/**
 * Parses and formats raw telephone/mobile numbers into standardized format
 */
export function formatPhoneNumber(rawPhone: string): string {
  if (!rawPhone) return '';
  const trimmed = rawPhone.trim();
  // Kenyan local mobile numbers: e.g. 0722 646 553, 0722646553, 254722646553
  const digitsOnly = trimmed.replace(/\D/g, '');
  if (digitsOnly.startsWith('254') && digitsOnly.length === 12) {
    return `+254 ${digitsOnly.slice(3, 6)} ${digitsOnly.slice(6, 9)} ${digitsOnly.slice(9)}`;
  }
  if (digitsOnly.startsWith('0') && digitsOnly.length === 10) {
    return `+254 ${digitsOnly.slice(1, 4)} ${digitsOnly.slice(4, 7)} ${digitsOnly.slice(7)}`;
  }
  if (trimmed.startsWith('+')) {
    return trimmed;
  }
  return `+254 ${trimmed}`;
}

/**
 * Deconstructs full name into first, middle, and last names while preserving doctorates
 */
export function parseNameParts(rawName: string): {
  honorific: string;
  firstName: string;
  middleName: string;
  lastName: string;
  displayName: string;
} {
  const clean = rawName.trim();
  const parts = clean.split(/\s+/);
  
  let honorific = 'Dr.';
  let workingParts = [...parts];

  if (parts[0]?.toLowerCase() === 'apostle') {
    honorific = 'Apostle Dr.';
    workingParts = workingParts.slice(1);
    if (workingParts[0]?.toLowerCase() === 'dr.' || workingParts[0]?.toLowerCase() === 'dr') {
      workingParts = workingParts.slice(1);
    }
  } else if (parts[0]?.toLowerCase() === 'dr.' || parts[0]?.toLowerCase() === 'dr') {
    honorific = 'Dr.';
    workingParts = workingParts.slice(1);
  } else if (parts[0]?.toLowerCase() === 'rev.' || parts[0]?.toLowerCase() === 'rev') {
    honorific = 'Rev. Dr.';
    workingParts = workingParts.slice(1);
  }

  let firstName = '';
  let middleName = '';
  let lastName = '';

  if (workingParts.length === 1) {
    firstName = workingParts[0];
    lastName = workingParts[0];
  } else if (workingParts.length === 2) {
    firstName = workingParts[0];
    lastName = workingParts[1];
  } else if (workingParts.length === 3) {
    firstName = workingParts[0];
    middleName = workingParts[1];
    lastName = workingParts[2];
  } else {
    firstName = workingParts[0];
    middleName = workingParts.slice(1, -1).join(' ');
    lastName = workingParts[workingParts.length - 1];
  }

  const displayName = `${honorific} ${firstName}${middleName ? ' ' + middleName : ''} ${lastName}`;

  return {
    honorific,
    firstName,
    middleName,
    lastName,
    displayName,
  };
}

/**
 * Maps a single raw 2022 Nakuru graduate record to the official BIBU Alumni schema
 */
export function mapRawGraduateToAlumni(
  raw: RawNakuruGraduateRecord,
  index: number = 0
): Alumni {
  const nameData = parseNameParts(raw.name);
  const formattedPhone = formatPhoneNumber(raw.mobile);
  const regNo = (raw.regNo || '').trim();
  const gradYear = Number(raw.graduationYear) || 2022;
  
  // Deterministic padded index string (e.g., NK01, NK02)
  const indexStr = String(index + 1).padStart(2, '0');
  const alumniId = `BIBU-ALM-2022-NK${indexStr}`;
  const certificateNumber = `BIBU-CERT-2022-HON-NK${indexStr}`;
  const uniqueId = `alm-nakuru-2022-${indexStr}`;

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
    country_code: 'KE',
    city: raw.city || 'Nakuru',
    email: (raw.email || '').trim().toLowerCase(),
    phone: formattedPhone,
    graduation_year: gradYear,
    graduation_date: '2022-04-08',
    program_id: 'prog-hondoc-div',
    program_name: 'Honorary Doctorate of Divinity (D.Div. Honoris Causa)',
    qualification_level: 'Honorary Doctorate',
    campus: raw.campus || "Nakuru Mother's Chapter / Central Rift",
    study_mode: 'On-Campus Resident',
    current_position: raw.role || 'Doctoral Conferred Alumna',
    organization: "Nakuru Mother's Chapter",
    profession: raw.profession || 'Christian Ministry & Community Leadership',
    ministry: raw.ministry || "Pastoral Ministry & Women's Fellowship",
    biography: `Conferred with an Honorary Doctorate of Divinity at the 2022 Nakuru Mother's Chapter Graduation Ceremony on April 8, 2022, in recognition of exemplary Christian character, gospel leadership, and community service.`,
    achievements: [
      'Honorary Doctorate Investiture 2022',
      "Nakuru Mother's Chapter Leadership Recognition",
      'Commended for Community Transformation & Faith Mentorship'
    ],
    chapter_id: 'ch-nakuru-mothers',
    verification_status: 'Verified Alumni',
    privacy_status: 'Public Profile',
    featured: index === 0 || index === 30, // Dr. Nancy Njeri Gitau & Apostle Dr. Milkah Nafula Kalest
    distinguished: true,
    distinguished_category: 'Ministry Leadership',
    is_demo: false,
    created_at: '2022-04-08T10:00:00Z',
    updated_at: new Date().toISOString(),
  };
}

export interface MigrationAuditItem {
  regNo: string;
  fullName: string;
  email: string;
  mobile: string;
  graduationYear: number;
  alumniId: string;
  certificateNumber: string;
  action: 'inserted' | 'updated' | 'verified';
  details: string;
}

export interface MigrationReport {
  success: boolean;
  timestamp: string;
  totalProvided: number;
  migratedCount: number;
  updatedCount: number;
  skippedCount: number;
  migratedRecords: Alumni[];
  auditTrail: MigrationAuditItem[];
  errors: string[];
}

/**
 * Migration Options
 */
export interface MigrationOptions {
  /** Optional custom raw records; if omitted, defaults to the official 32 Nakuru graduates */
  rawRecords?: RawNakuruGraduateRecord[];
  /** Existing alumni array to merge into. If omitted in browser, attempts reading from localStorage */
  existingDatabase?: Alumni[];
  /** If true, will not commit changes to localStorage */
  dryRun?: boolean;
}

/**
 * Core Data Migration Function: Bulk-imports the 2022 Nakuru Mother's Chapter graduates
 * ensuring all required fields (Name, Mobile, Email, Reg No, Graduation Year) are mapped.
 */
export function migrateNakuru2022Graduates(options: MigrationOptions = {}): MigrationReport {
  const sourceRecords = options.rawRecords && options.rawRecords.length > 0
    ? options.rawRecords
    : RAW_NAKURU_2022_GRADUATES;

  const errors: string[] = [];
  const auditTrail: MigrationAuditItem[] = [];
  const migratedRecords: Alumni[] = [];

  // Determine existing database
  let db: Alumni[] = [];
  if (options.existingDatabase) {
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
      const gradYear = Number(raw.graduationYear) || 2022;
      if (gradYear !== 2022) {
        errors.push(`Row ${idx + 1} (${raw.name}): Graduation year is ${gradYear}, expected 2022`);
      }

      // Map raw record to standard Alumni entity
      const alumniEntity = mapRawGraduateToAlumni(raw, idx);
      migratedRecords.push(alumniEntity);

      // Check if candidate already exists by Reg No (student_id), email, alumni_id, or id
      const existingIdx = db.findIndex(
        (a) =>
          (a.student_id && a.student_id.toLowerCase() === alumniEntity.student_id.toLowerCase()) ||
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
        };
        updatedCount++;
        auditTrail.push({
          regNo: alumniEntity.student_id,
          fullName: alumniEntity.full_name,
          email: alumniEntity.email,
          mobile: alumniEntity.phone,
          graduationYear: alumniEntity.graduation_year,
          alumniId: alumniEntity.alumni_id,
          certificateNumber: alumniEntity.certificate_number,
          action: 'updated',
          details: `Updated verified record for ${alumniEntity.full_name} (${alumniEntity.student_id})`,
        });
      } else {
        // Insert new record
        db.push(alumniEntity);
        insertedCount++;
        auditTrail.push({
          regNo: alumniEntity.student_id,
          fullName: alumniEntity.full_name,
          email: alumniEntity.email,
          mobile: alumniEntity.phone,
          graduationYear: alumniEntity.graduation_year,
          alumniId: alumniEntity.alumni_id,
          certificateNumber: alumniEntity.certificate_number,
          action: 'inserted',
          details: `Inserted new verified record for ${alumniEntity.full_name} (${alumniEntity.student_id})`,
        });
      }
    } catch (err) {
      errors.push(`Row ${idx + 1} (${raw.name}): Processing exception - ${String(err)}`);
    }
  });

  // Save back to localStorage if in browser environment and not dryRun
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
