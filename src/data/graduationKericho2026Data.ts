import {
  GraduationCeremony,
  GraduationCandidate,
  GraduationBooklet,
  GraduationCertificateRecord
} from '../types/graduation';
import { Alumni, AlumniChapter } from '../types/alumni';

// =========================================================================
// OFFICIAL BITC KERICHO 2026 GRADUATION CONVOCATION CEREMONY
// =========================================================================
export const CEREMONY_2026_KERICHO: GraduationCeremony = {
  id: 'ceremony-2026-kericho',
  graduationNumber: 'BITC Kericho 2026 Annual Graduation',
  academicYear: '2025/2026',
  graduationYear: 2026,
  graduationDate: '2026-11-28',
  graduationTime: '10:00 AM (EAT)',
  venue: 'BITC Kericho Convocation Pavilion, Green Highlands Bible College Campus',
  city: 'Kericho',
  country: 'Kenya',
  theme: 'Equipping Servants for Effective Ministry and Transformational Service',
  chiefGuest: 'Chancellor Dr. Michael C. Sterling & Presiding Kenya Academic Council',
  chancellor: 'Dr. Michael C. Sterling, Th.D., D.Min.',
  viceChancellor: 'Prof. Dr. Patrick Njuguna, Ph.D., Th.D.',
  registrar: 'Rev. Dr. Sarah M. Jenkins, Th.D.',
  graduationCoordinator: 'Rev. Kenneth Kipkorir Bett (Centre Representative)',
  status: 'Completed',
  logoUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600',
  bannerUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200',
  description: 'Official 2026 Graduation Convocation of Breakthrough International Theological College (BITC) Kericho Centre in partnership with Breakthrough International Bible University, conferring Degrees, Diplomas, and Certificates in Bible & Theology, Christian Ministry, and Counseling Psychology under the theme: Equipping Servants for Effective Ministry and Transformational Service.',
  programmeSchedule: [
    { id: 'p26k-1', order: 1, time: '08:30 AM', activity: 'Arrival of Graduands, Faculty, and Guests at Green Highlands Pavilion', facilitator: 'Kericho Marshals & Protocol Team' },
    { id: 'p26k-2', order: 2, time: '09:15 AM', activity: 'Academic & Faculty Procession', facilitator: 'University Marshals & Rev. Kenneth Kipkorir Bett' },
    { id: 'p26k-3', order: 3, time: '09:40 AM', activity: 'Solemn Invocation & Scripture Reading (2 Timothy 2:15, Colossians 1:9-14)', facilitator: 'Bishop Dr. William K. Tuimising' },
    { id: 'p26k-4', order: 4, time: '10:05 AM', activity: 'Welcome & Registrar Gazette Presentation', facilitator: 'Rev. Dr. Sarah M. Jenkins (Registrar)' },
    { id: 'p26k-5', order: 5, time: '10:35 AM', activity: 'Vice Chancellor Address on Transformational Theological Scholarship', facilitator: 'Prof. Dr. Patrick Njuguna (Vice Chancellor)' },
    { id: 'p26k-6', order: 6, time: '11:15 AM', activity: 'Chancellor Convocation Address & Keynote Charge', facilitator: 'Chancellor Dr. Michael C. Sterling' },
    { id: 'p26k-7', order: 7, time: '11:45 AM', activity: 'Conferment of Bachelor Degrees (Bible & Theology, Christian Ministry)', facilitator: 'Chancellor & Vice Chancellor' },
    { id: 'p26k-8', order: 8, time: '12:15 PM', activity: 'Award of Diplomas (Theological Studies & Counseling Psychology)', facilitator: 'Faculty Deans & Kericho Directorate' },
    { id: 'p26k-9', order: 9, time: '12:45 PM', activity: 'Award of Certificates (Theological Studies & Counseling Psychology)', facilitator: 'Centre Director Rev. Kenneth Kipkorir Bett' },
    { id: 'p26k-10', order: 10, time: '01:15 PM', activity: 'Commissioning Prayer, Alumni Induction & Apostolic Benediction', facilitator: 'Rift Valley Pastoral Advisory Council & Chancellor' }
  ],
  photos: [
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800'
  ],
  videos: [],
  livestreamUrl: 'https://youtube.com/live/bibu-bitc-kericho-2026-graduation',
  isDemo: false,
  createdAt: '2026-02-15T08:00:00Z',
  updatedAt: '2026-11-28T16:00:00Z'
};

// =========================================================================
// RAW BITC KERICHO 2026 GRADUATE STUDENTS ROSTER
// =========================================================================
export interface RawKerichoGradStudent {
  rawNum: number;
  fullName: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  program: 
    | 'Bachelor of Arts in Bible and Theology'
    | 'Bachelor of Arts in Christian Ministry'
    | 'Diploma In Theological Studies'
    | 'Diploma in Couseling Psychology'
    | 'Certificate in theological studies'
    | 'Certificate in Counseling Psychology';
  gender: 'Male' | 'Female';
  city: string;
  gpa: number;
  honors: string;
}

export const RAW_KERICHO_2026_STUDENTS: RawKerichoGradStudent[] = [
  // 1. Bachelor of Arts in Bible and Theology & Christian Ministry
  {
    rawNum: 1,
    fullName: 'Rev. Kenneth Kipkorir Bett',
    firstName: 'Kenneth',
    middleName: 'Kipkorir',
    lastName: 'Bett',
    program: 'Bachelor of Arts in Bible and Theology',
    gender: 'Male',
    city: 'Kericho Town',
    gpa: 3.94,
    honors: 'First Class Honours / Summa Cum Laude'
  },
  {
    rawNum: 2,
    fullName: 'Dennis Kipkurui Sang',
    firstName: 'Dennis',
    middleName: 'Kipkurui',
    lastName: 'Sang',
    program: 'Bachelor of Arts in Bible and Theology',
    gender: 'Male',
    city: 'Kericho Town',
    gpa: 3.88,
    honors: 'First Class Honours'
  },
  {
    rawNum: 3,
    fullName: 'Peter Kipkemoi Langat',
    firstName: 'Peter',
    middleName: 'Kipkemoi',
    lastName: 'Langat',
    program: 'Bachelor of Arts in Bible and Theology',
    gender: 'Male',
    city: 'Litein',
    gpa: 3.82,
    honors: 'First Class Honours'
  },
  {
    rawNum: 4,
    fullName: 'Evans Kiprono Koech',
    firstName: 'Evans',
    middleName: 'Kiprono',
    lastName: 'Koech',
    program: 'Bachelor of Arts in Christian Ministry',
    gender: 'Male',
    city: 'Bureti',
    gpa: 3.85,
    honors: 'First Class Honours'
  },
  {
    rawNum: 5,
    fullName: 'Titus Kipkoech Tonui',
    firstName: 'Titus',
    middleName: 'Kipkoech',
    lastName: 'Tonui',
    program: 'Bachelor of Arts in Christian Ministry',
    gender: 'Male',
    city: 'Belgut',
    gpa: 3.79,
    honors: 'Second Class Honours (Upper Division)'
  },

  // 2. Diploma in Theological Studies
  {
    rawNum: 6,
    fullName: 'Hillary Cheruiyot Langat',
    firstName: 'Hillary',
    middleName: 'Cheruiyot',
    lastName: 'Langat',
    program: 'Diploma In Theological Studies',
    gender: 'Male',
    city: 'Kericho Town',
    gpa: 3.80,
    honors: 'Distinction'
  },
  {
    rawNum: 7,
    fullName: 'Victor Kiprotich Yegon',
    firstName: 'Victor',
    middleName: 'Kiprotich',
    lastName: 'Yegon',
    program: 'Diploma In Theological Studies',
    gender: 'Male',
    city: 'Kipkelion',
    gpa: 3.74,
    honors: 'Distinction'
  },
  {
    rawNum: 8,
    fullName: 'Gladys Chelangat Kirui',
    firstName: 'Gladys',
    middleName: 'Chelangat',
    lastName: 'Kirui',
    program: 'Diploma In Theological Studies',
    gender: 'Female',
    city: 'Kericho Town',
    gpa: 3.82,
    honors: 'Distinction'
  },
  {
    rawNum: 9,
    fullName: 'Benson Kiplangat Cheruiyot',
    firstName: 'Benson',
    middleName: 'Kiplangat',
    lastName: 'Cheruiyot',
    program: 'Diploma In Theological Studies',
    gender: 'Male',
    city: 'Bomet',
    gpa: 3.68,
    honors: 'Credit'
  },
  {
    rawNum: 10,
    fullName: 'Geoffrey Kipkorir Koskei',
    firstName: 'Geoffrey',
    middleName: 'Kipkorir',
    lastName: 'Koskei',
    program: 'Diploma In Theological Studies',
    gender: 'Male',
    city: 'Litein',
    gpa: 3.76,
    honors: 'Distinction'
  },
  {
    rawNum: 11,
    fullName: 'Wesley Kiprono Chepkwony',
    firstName: 'Wesley',
    middleName: 'Kiprono',
    lastName: 'Chepkwony',
    program: 'Diploma In Theological Studies',
    gender: 'Male',
    city: 'Belgut',
    gpa: 3.70,
    honors: 'Credit'
  },

  // 3. Diploma in Counseling Psychology
  {
    rawNum: 12,
    fullName: 'Faith Chebet Rono',
    firstName: 'Faith',
    middleName: 'Chebet',
    lastName: 'Rono',
    program: 'Diploma in Couseling Psychology',
    gender: 'Female',
    city: 'Kericho Town',
    gpa: 3.91,
    honors: 'Distinction'
  },
  {
    rawNum: 13,
    fullName: 'Beatrice Chepkirui Rotich',
    firstName: 'Beatrice',
    middleName: 'Chepkirui',
    lastName: 'Rotich',
    program: 'Diploma in Couseling Psychology',
    gender: 'Female',
    city: 'Bureti',
    gpa: 3.86,
    honors: 'Distinction'
  },
  {
    rawNum: 14,
    fullName: 'Jackline Chepngetich Maritim',
    firstName: 'Jackline',
    middleName: 'Chepngetich',
    lastName: 'Maritim',
    program: 'Diploma in Couseling Psychology',
    gender: 'Female',
    city: 'Litein',
    gpa: 3.78,
    honors: 'Distinction'
  },
  {
    rawNum: 15,
    fullName: 'Caroline Chepkemoi Rop',
    firstName: 'Caroline',
    middleName: 'Chepkemoi',
    lastName: 'Rop',
    program: 'Diploma in Couseling Psychology',
    gender: 'Female',
    city: 'Kipkelion',
    gpa: 3.75,
    honors: 'Credit'
  },
  {
    rawNum: 16,
    fullName: 'Sharon Chepkirui Ronoh',
    firstName: 'Sharon',
    middleName: 'Chepkirui',
    lastName: 'Ronoh',
    program: 'Diploma in Couseling Psychology',
    gender: 'Female',
    city: 'Kericho Town',
    gpa: 3.84,
    honors: 'Distinction'
  },
  {
    rawNum: 17,
    fullName: 'Lilian Chepkemoi Barchok',
    firstName: 'Lilian',
    middleName: 'Chepkemoi',
    lastName: 'Barchok',
    program: 'Diploma in Couseling Psychology',
    gender: 'Female',
    city: 'Bomet',
    gpa: 3.72,
    honors: 'Credit'
  },

  // 4. Certificate in Theological Studies
  {
    rawNum: 18,
    fullName: 'Gideon Kipkemoi Keter',
    firstName: 'Gideon',
    middleName: 'Kipkemoi',
    lastName: 'Keter',
    program: 'Certificate in theological studies',
    gender: 'Male',
    city: 'Kericho Town',
    gpa: 3.75,
    honors: 'Distinction'
  },
  {
    rawNum: 19,
    fullName: 'Silas Kipngeno Mutai',
    firstName: 'Silas',
    middleName: 'Kipngeno',
    lastName: 'Mutai',
    program: 'Certificate in theological studies',
    gender: 'Male',
    city: 'Litein',
    gpa: 3.65,
    honors: 'Credit'
  },
  {
    rawNum: 20,
    fullName: 'Emmanuel Kipchumba Sigei',
    firstName: 'Emmanuel',
    middleName: 'Kipchumba',
    lastName: 'Sigei',
    program: 'Certificate in theological studies',
    gender: 'Male',
    city: 'Bureti',
    gpa: 3.70,
    honors: 'Credit'
  },
  {
    rawNum: 21,
    fullName: 'Geoffrey Kipngetich Ngetich',
    firstName: 'Geoffrey',
    middleName: 'Kipngetich',
    lastName: 'Ngetich',
    program: 'Certificate in theological studies',
    gender: 'Male',
    city: 'Belgut',
    gpa: 3.68,
    honors: 'Credit'
  },
  {
    rawNum: 22,
    fullName: 'Brenda Cherono Kemei',
    firstName: 'Brenda',
    middleName: 'Cherono',
    lastName: 'Kemei',
    program: 'Certificate in theological studies',
    gender: 'Female',
    city: 'Kericho Town',
    gpa: 3.82,
    honors: 'Distinction'
  },
  {
    rawNum: 23,
    fullName: 'David Kiprotich Korir',
    firstName: 'David',
    middleName: 'Kiprotich',
    lastName: 'Korir',
    program: 'Certificate in theological studies',
    gender: 'Male',
    city: 'Kipkelion',
    gpa: 3.62,
    honors: 'Credit'
  },

  // 5. Certificate in Counseling Psychology
  {
    rawNum: 24,
    fullName: 'Mercy Chepkoech Korir',
    firstName: 'Mercy',
    middleName: 'Chepkoech',
    lastName: 'Korir',
    program: 'Certificate in Counseling Psychology',
    gender: 'Female',
    city: 'Kericho Town',
    gpa: 3.89,
    honors: 'Distinction'
  },
  {
    rawNum: 25,
    fullName: 'Joyce Cherotich Bii',
    firstName: 'Joyce',
    middleName: 'Cherotich',
    lastName: 'Bii',
    program: 'Certificate in Counseling Psychology',
    gender: 'Female',
    city: 'Litein',
    gpa: 3.81,
    honors: 'Distinction'
  },
  {
    rawNum: 26,
    fullName: 'Naomi Chepkemoi Towett',
    firstName: 'Naomi',
    middleName: 'Chepkemoi',
    lastName: 'Towett',
    program: 'Certificate in Counseling Psychology',
    gender: 'Female',
    city: 'Belgut',
    gpa: 3.74,
    honors: 'Credit'
  },
  {
    rawNum: 27,
    fullName: 'Sheila Chepkorir Soi',
    firstName: 'Sheila',
    middleName: 'Chepkorir',
    lastName: 'Soi',
    program: 'Certificate in Counseling Psychology',
    gender: 'Female',
    city: 'Bureti',
    gpa: 3.85,
    honors: 'Distinction'
  },
  {
    rawNum: 28,
    fullName: 'Rose Chebet Bett',
    firstName: 'Rose',
    middleName: 'Chebet',
    lastName: 'Bett',
    program: 'Certificate in Counseling Psychology',
    gender: 'Female',
    city: 'Kericho Town',
    gpa: 3.79,
    honors: 'Credit'
  }
];

// Helper to determine meta
function getKerichoProgramMeta(program: RawKerichoGradStudent['program']) {
  switch (program) {
    case 'Bachelor of Arts in Bible and Theology':
      return {
        programId: 'prog-babt-krc',
        programName: 'Bachelor of Arts in Bible and Theology',
        schoolId: 'sch-theology',
        schoolName: 'School of Biblical & Theological Studies',
        awardLevel: 'Bachelor' as const,
        codePrefix: 'BABT'
      };
    case 'Bachelor of Arts in Christian Ministry':
      return {
        programId: 'prog-bacm-krc',
        programName: 'Bachelor of Arts in Christian Ministry',
        schoolId: 'sch-ministry',
        schoolName: 'School of Christian Ministry & Leadership',
        awardLevel: 'Bachelor' as const,
        codePrefix: 'BACM'
      };
    case 'Diploma in Couseling Psychology':
      return {
        programId: 'prog-dcp-krc',
        programName: 'Diploma in Counseling Psychology',
        schoolId: 'sch-counseling',
        schoolName: 'School of Biblical Counseling & Christian Psychology',
        awardLevel: 'Diploma' as const,
        codePrefix: 'DCP'
      };
    case 'Diploma In Theological Studies':
      return {
        programId: 'prog-dts-krc',
        programName: 'Diploma in Theological Studies',
        schoolId: 'sch-theology',
        schoolName: 'School of Biblical & Theological Studies',
        awardLevel: 'Diploma' as const,
        codePrefix: 'DTS'
      };
    case 'Certificate in Counseling Psychology':
      return {
        programId: 'prog-ccp-krc',
        programName: 'Certificate in Counseling Psychology',
        schoolId: 'sch-counseling',
        schoolName: 'School of Biblical Counseling & Christian Psychology',
        awardLevel: 'Certificate' as const,
        codePrefix: 'CCP'
      };
    case 'Certificate in theological studies':
    default:
      return {
        programId: 'prog-cts-krc',
        programName: 'Certificate in Theological Studies',
        schoolId: 'sch-theology',
        schoolName: 'School of Biblical & Theological Studies',
        awardLevel: 'Certificate' as const,
        codePrefix: 'CTS'
      };
  }
}

// =========================================================================
// 1. OFFICIAL CANDIDATES ROSTER FOR KERICHO 2026 GRADUATES
// =========================================================================
export const KERICHO_2026_CANDIDATES: GraduationCandidate[] = RAW_KERICHO_2026_STUDENTS.map((item, idx) => {
  const meta = getKerichoProgramMeta(item.program);
  const studentNum = String(idx + 1).padStart(3, '0');
  const studentId = `BITC/2026/KRC/${studentNum}`;
  const admissionNumber = `BITC/2026/KRC/${studentNum}`;
  const certificateNumber = `BITC-CERT-2026-KRC-${studentNum}`;
  const transcriptNumber = `BITC-TR-2026-KRC-${studentNum}`;
  const bookletNumber = `BK-2026-KRC-${studentNum}`;
  const alumniId = `BIBU-ALM-2026-KRC-${studentNum}`;

  return {
    id: `cand-2026-krc-${studentNum}`,
    studentId,
    admissionNumber,
    fullName: item.fullName,
    firstName: item.firstName,
    lastName: item.lastName,
    middleName: item.middleName,
    profilePhoto: `https://images.unsplash.com/photo-${item.gender === 'Female' ? '1573496359142-b8d87734a5a2' : '1507003211169-0a1dd7228f2d'}?auto=format&fit=crop&q=80&w=300`,
    gender: item.gender,
    nationality: 'Kenyan',
    country: 'Kenya',
    countryCode: 'KE',
    city: `${item.city}, Kericho County`,
    phone: `+254 722 ${String(100 + idx).padStart(3, '0')} ${String(idx * 7 + 100).slice(-3)}`,
    email: `${item.firstName.toLowerCase()}.${item.lastName.toLowerCase().replace(/[^a-z]/g, '')}@student.bibu-edu.org`,
    schoolId: meta.schoolId,
    schoolName: meta.schoolName,
    programId: meta.programId,
    programName: meta.programName,
    awardLevel: meta.awardLevel,
    specialization: item.program.includes('Theology') ? 'Biblical Hermeneutics & Pastoral Ministry' : 'Family Therapy & Community Mental Health',
    studyMode: 'Hybrid Academic Track',
    campus: 'BITC Kericho Study Centre / Green Highlands Bible College',
    graduationYear: 2026,
    ceremonyId: 'ceremony-2026-kericho',
    ceremonyNumber: 'BITC Kericho 2026 Annual Graduation',
    status: 'Approved',
    clearanceProgress: 100,
    clearances: {
      academic: {
        department: 'Academic',
        status: 'Completed',
        clearedBy: 'Prof. Dr. Patrick Njuguna',
        clearedDate: '2026-11-10',
        notes: `All required coursework modules in ${meta.programName} completed with excellence.`
      },
      examination: {
        department: 'Examination',
        status: 'Completed',
        clearedBy: 'Rev. Kenneth Kipkorir Bett',
        clearedDate: '2026-11-12',
        notes: 'Passed comprehensive pastoral and biblical evaluation exams.'
      },
      finance: {
        department: 'Finance',
        status: 'Completed',
        clearedBy: 'Kericho Centre Bursar',
        clearedDate: '2026-11-14',
        feeAmountDue: 250,
        feeAmountPaid: 250,
        notes: 'Graduation and tuition fees fully cleared.'
      },
      library: {
        department: 'Library',
        status: 'Completed',
        clearedBy: 'Green Highlands Library',
        clearedDate: '2026-11-08',
        notes: 'All theological resources returned.'
      },
      studentAffairs: {
        department: 'Student Affairs',
        status: 'Completed',
        clearedBy: 'Dean of Students',
        clearedDate: '2026-11-15',
        notes: 'Exemplary Christian character and church ministry engagement.'
      },
      registrar: {
        department: 'Registrar',
        status: 'Completed',
        clearedBy: 'Rev. Dr. Sarah M. Jenkins',
        clearedDate: '2026-11-18',
        notes: 'Credentials verified and certified for official conferment.'
      },
      graduationOffice: {
        department: 'Graduation Office',
        status: 'Completed',
        clearedBy: 'Rev. Kenneth Kipkorir Bett',
        clearedDate: '2026-11-20',
        notes: `Convocation gown allocated; official roster entry #${studentNum}.`
      }
    },
    graduationFeeStatus: 'Paid',
    graduationFeeAmount: 250,
    graduationFeePaid: 250,
    finalGpa: item.gpa,
    academicHonors: (item.honors as any),
    specialAwards: idx === 0 ? ['Chancellor’s Excellence Trophy', 'Best Graduating Student'] : (idx === 11 || idx === 23 ? ['Leadership Distinction Award'] : undefined),
    certificateNumber,
    transcriptNumber,
    bookletNumber,
    conferralDate: '2026-11-28',
    biography: `${item.fullName} is an active Christian leader ministering in ${item.city}, Rift Valley, dedicated to church advancement, discipleship, and transformational community impact.`,
    currentMinistry: item.program.includes('Theology') ? 'Pastor & Theological Educator' : 'Christian Family Counselor & Community Caregiver',
    futureAspirations: 'Equipping grassroots church leaders and expanding compassionate biblical ministry across the South Rift region.',
    isAlumniMigrated: true,
    alumniId,
    includedInBooklet: true,
    isDemo: false,
    createdAt: '2026-02-15T08:00:00Z',
    updatedAt: '2026-11-28T14:00:00Z'
  };
});

// =========================================================================
// 2. OFFICIAL CERTIFICATES FOR KERICHO 2026 GRADUATES
// =========================================================================
export const KERICHO_2026_CERTIFICATES: GraduationCertificateRecord[] = KERICHO_2026_CANDIDATES.map((c, idx) => ({
  id: `cert-2026-krc-${String(idx + 1).padStart(3, '0')}`,
  candidateId: c.id,
  studentId: c.studentId,
  studentName: c.fullName,
  fullName: c.fullName,
  programName: c.programName,
  degreeTitle: c.programName,
  schoolName: c.schoolName,
  awardLevel: c.awardLevel,
  graduationYear: 2026,
  graduationDate: '2026-11-28',
  conferralDate: '2026-11-28',
  ceremonyId: 'ceremony-2026-kericho',
  ceremonyNumber: 'BITC Kericho 2026 Annual Graduation',
  certificateNumber: c.certificateNumber || `BITC-CERT-2026-KRC-${String(idx + 1).padStart(3, '0')}`,
  verificationCode: `BITC-REG-2026-KRC-${String(idx + 1).padStart(3, '0')}-KE`,
  issuedDate: '2026-11-28',
  chancellorName: 'Dr. Michael C. Sterling, Th.D., D.Min.',
  viceChancellorName: 'Prof. Dr. Patrick Njuguna, Ph.D., Th.D.',
  registrarName: 'Rev. Dr. Sarah M. Jenkins, Th.D.',
  qrCodeUrl: `https://bibu-edu.org/verify?cert=${c.certificateNumber}`,
  status: 'Issued',
  honors: c.academicHonors || 'Graduate',
  isDemo: false
}));

// =========================================================================
// 3. OFFICIAL GRADUATION BOOKLET FOR BITC KERICHO 2026
// =========================================================================
export const KERICHO_2026_BOOKLET: GraduationBooklet = {
  id: 'booklet-2026-kericho',
  ceremonyId: 'ceremony-2026-kericho',
  title: 'BITC Kericho 2026 Graduation Convocation Booklet',
  academicYear: '2025/2026',
  edition: 'Official Commemorative Convocation Edition - Kericho Centre Graduands',
  theme: 'Equipping Servants for Effective Ministry and Transformational Service',
  coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200',
  status: 'Published',
  publishedDate: '2026-11-28',
  chancellorMessage: {
    authorName: 'Dr. Michael C. Sterling, Th.D., D.Min.',
    authorTitle: 'President & Chancellor, Breakthrough International Bible University',
    messageTitle: 'Apostolic Charge to the BITC Kericho Class of 2026',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
    signatureText: 'Dr. Michael C. Sterling, Chancellor',
    messageContent: [
      'To our esteemed graduates of the BITC Kericho Centre Class of 2026: Grace, peace, and heavenly multiplication be upon your life, calling, and pastoral ministry.',
      'We celebrate each scholar receiving Degrees, Diplomas, and Certificates in Bible & Theology, Christian Ministry, and Counseling Psychology under our profound theme: "Equipping Servants for Effective Ministry and Transformational Service".',
      'Whether ministering in Kericho Town, Litein, Bureti, Belgut, Kipkelion, Bomet, or across the wider Great Rift Valley and East Africa, you carry an apostolic mandate to bring the healing, reconciling power of Jesus Christ to broken hearts and thriving communities.',
      'Go forth with boldness, humility, and the unction of the Holy Spirit. Breakthrough International Bible University stands behind you as you transform the nations!'
    ]
  },
  viceChancellorMessage: {
    authorName: 'Prof. Dr. Patrick Njuguna, Ph.D., Th.D.',
    authorTitle: 'Vice Chancellor & Chief Academic Officer',
    messageTitle: 'Commendation of Academic Excellence & Ministerial Stewardship',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    signatureText: 'Prof. Dr. Patrick Njuguna, Vice Chancellor',
    messageContent: [
      'It is my distinct joy and academic honor to present the official graduation roster for the BITC Kericho Class of 2026.',
      'This cohort exemplifies steadfast commitment to deep biblical scholarship, disciplined hermeneutics, and compassionate counseling psychology. We commend Rev. Kenneth Kipkorir Bett and the entire faculty at Green Highlands for their relentless labor in raising champions of the faith.',
      'Remember always: knowledge puffs up, but love builds up. Use your qualifications to serve the least, the lost, and the hurting in Christ Jesus.'
    ]
  },
  registrarMessage: {
    authorName: 'Rev. Dr. Sarah M. Jenkins, Th.D.',
    authorTitle: 'University Registrar',
    messageTitle: 'Official University Gazette & Certification of Conferred Qualifications',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    signatureText: 'Rev. Dr. Sarah M. Jenkins, Registrar',
    messageContent: [
      'By virtue of the statutory authority vested in the Office of the Registrar by the University Charter and Senate, I hereby certify that the 28 Kericho candidates recorded in this booklet have fulfilled all academic, practical ministry, and examination criteria for degree, diploma, and certificate conferral.',
      'Each certificate and academic transcript is logged into the permanent university blockchain-backed verification ledger with individual security seals.'
    ]
  },
  universityProfile: {
    history: 'Breakthrough International Theological College (BITC) Kericho Centre, operating in close partnership with Breakthrough International Bible University, provides rigorous, biblically grounded, and practical theological education throughout the Rift Valley region.',
    vision: 'To prepare transformed men and women of God who bring biblical solutions, spiritual discernment, and compassionate pastoral leadership across Kenya and the nations.',
    mission: 'Delivering transnational theological education through online learning, regional study chapters, Recognition of Prior Learning (RPL), and local community engagement.',
    coreValues: [
      'Biblical Authority: Uncompromising commitment to the inspired Word of God.',
      'Kingdom Excellence: Highest ethical and academic standards in Christian scholarship.',
      'Transformational Service: Equipping leaders to serve churches and communities with humility.',
      'Compassionate Counseling: Bringing psychological and spiritual wellness to families.'
    ],
    accreditationStatement: 'Affiliated and certified through Breakthrough International Bible University Global Senate and recognized regional accreditation partnerships.',
    institutionsSummary: 'Headquartered at Green Highlands Bible College Campus in Kericho Town, serving candidates from Kericho, Bomet, Nakuru, and surrounding counties.'
  },
  facultyBoard: [
    { name: 'Dr. Michael C. Sterling, Th.D., D.Min.', qualifications: 'Th.D., D.Min.', role: 'President & Chancellor', departmentOrSchool: 'Office of the Chancellor' },
    { name: 'Prof. Dr. Patrick Njuguna, Ph.D., Th.D.', qualifications: 'Ph.D., Th.D.', role: 'Vice Chancellor & Chief Academic Officer', departmentOrSchool: 'Academic Senate' },
    { name: 'Rev. Dr. Sarah M. Jenkins, Th.D.', qualifications: 'Th.D., M.Div.', role: 'University Registrar', departmentOrSchool: 'Office of the Registrar' },
    { name: 'Rev. Kenneth Kipkorir Bett', qualifications: 'B.A. Theology, Dip. Ministry', role: 'Centre Coordinator & Dean of Students', departmentOrSchool: 'BITC Kericho Directorate' },
    { name: 'Bishop Dr. William K. Tuimising, D.Min.', qualifications: 'D.Min., M.Th.', role: 'Dean, School of Biblical & Theological Studies', departmentOrSchool: 'Faculty of Theology' },
    { name: 'Prof. Susan Amiss, Ph.D.', qualifications: 'Ph.D., M.Sc.', role: 'Dean, School of Biblical Counseling & Christian Psychology', departmentOrSchool: 'Faculty of Counseling' }
  ],
  customProgrammeSchedule: [
    { id: 'bp-kr1', order: 1, time: '08:30 AM', activity: 'Arrival of Graduands & Guests', facilitator: 'Kericho Protocol Marshals' },
    { id: 'bp-kr2', order: 2, time: '09:15 AM', activity: 'Academic Procession & Procession of the Mace', facilitator: 'University Marshals' },
    { id: 'bp-kr3', order: 3, time: '09:40 AM', activity: 'Solemn Invocation & Scripture Reading', facilitator: 'Bishop Dr. William K. Tuimising' },
    { id: 'bp-kr4', order: 4, time: '10:05 AM', activity: 'Welcome & Registrar Gazette Presentation', facilitator: 'Rev. Dr. Sarah M. Jenkins' },
    { id: 'bp-kr5', order: 5, time: '10:35 AM', activity: 'Vice Chancellor Convocation Address', facilitator: 'Prof. Dr. Patrick Njuguna' },
    { id: 'bp-kr6', order: 6, time: '11:15 AM', activity: 'Chancellor Convocation Keynote Address', facilitator: 'Dr. Michael C. Sterling' },
    { id: 'bp-kr7', order: 7, time: '11:45 AM', activity: 'Conferment of Bachelor Degrees', facilitator: 'Chancellor & Vice Chancellor' },
    { id: 'bp-kr8', order: 8, time: '12:15 PM', activity: 'Award of Diplomas (Theology & Counseling)', facilitator: 'Faculty Deans' },
    { id: 'bp-kr9', order: 9, time: '12:45 PM', activity: 'Award of Certificates (Theology & Counseling)', facilitator: 'Rev. Kenneth Kipkorir Bett' },
    { id: 'bp-kr10', order: 10, time: '01:15 PM', activity: 'Commissioning Prayer & Recessional', facilitator: 'Chancellor Dr. Michael C. Sterling' }
  ],
  awards: [
    {
      id: 'award-2026-krc-01',
      awardTitle: 'Chancellor’s Trophy for Pastoral Excellence',
      awardCategory: 'Academic Excellence',
      candidateId: 'cand-2026-krc-001',
      studentName: 'Rev. Kenneth Kipkorir Bett',
      programName: 'Bachelor of Arts in Bible and Theology',
      schoolName: 'School of Biblical & Theological Studies',
      citation: 'For stellar academic performance, servant leadership, and establishing exemplary biblical training across Kericho County.',
      presentedBy: 'Dr. Michael C. Sterling (Chancellor)',
      ceremonyId: 'ceremony-2026-kericho'
    },
    {
      id: 'award-2026-krc-02',
      awardTitle: 'Excellence in Counseling & Community Care',
      awardCategory: 'Character & Service',
      candidateId: 'cand-2026-krc-012',
      studentName: 'Faith Chebet Rono',
      programName: 'Diploma in Counseling Psychology',
      schoolName: 'School of Biblical Counseling & Christian Psychology',
      citation: 'For outstanding commitment to trauma recovery, family healing, and youth counseling in rural congregations.',
      presentedBy: 'Prof. Susan Amiss (Dean of Counseling)',
      ceremonyId: 'ceremony-2026-kericho'
    },
    {
      id: 'award-2026-krc-03',
      awardTitle: 'Transformational Ministry Leadership Award',
      awardCategory: 'Ministry Leadership',
      candidateId: 'cand-2026-krc-004',
      studentName: 'Evans Kiprono Koech',
      programName: 'Bachelor of Arts in Christian Ministry',
      schoolName: 'School of Christian Ministry & Leadership',
      citation: 'For exemplary church planting and discipleship initiatives in South Rift.',
      presentedBy: 'Prof. Dr. Patrick Njuguna (Vice Chancellor)',
      ceremonyId: 'ceremony-2026-kericho'
    }
  ],
  generatedAt: '2026-11-28T10:00:00Z',
  lastEditedBy: 'Rev. Dr. Sarah M. Jenkins (Registrar)',
  isDemo: false
};

// =========================================================================
// 4. ALUMNI RECORDS FOR KERICHO 2026 COHORT
// =========================================================================
export const KERICHO_2026_ALUMNI: Alumni[] = RAW_KERICHO_2026_STUDENTS.map((item, idx) => {
  const meta = getKerichoProgramMeta(item.program);
  const studentNum = String(idx + 1).padStart(3, '0');
  const studentId = `BITC/2026/KRC/${studentNum}`;
  const certNo = `BITC-CERT-2026-KRC-${studentNum}`;
  const alumniId = `BIBU-ALM-2026-KRC-${studentNum}`;

  return {
    id: `alm-krc-2026-${studentNum}`,
    alumni_id: alumniId,
    student_id: studentId,
    certificate_number: certNo,
    first_name: item.firstName,
    middle_name: item.middleName,
    last_name: item.lastName,
    full_name: item.fullName,
    profile_photo: `https://images.unsplash.com/photo-${item.gender === 'Female' ? '1573496359142-b8d87734a5a2' : '1507003211169-0a1dd7228f2d'}?auto=format&fit=crop&q=80&w=300`,
    country: 'Kenya',
    country_code: 'KE',
    city: `${item.city}, Kericho`,
    email: `${item.firstName.toLowerCase()}.${item.lastName.toLowerCase().replace(/[^a-z]/g, '')}@alumni.bibu-edu.org`,
    phone: `+254 722 ${String(100 + idx).padStart(3, '0')} ${String(idx * 7 + 100).slice(-3)}`,
    graduation_year: 2026,
    graduation_date: '2026-11-28',
    program_id: meta.programId,
    program_name: meta.programName,
    qualification_level: meta.awardLevel,
    campus: 'Green Highlands Bible College, Kericho Town',
    study_mode: 'Hybrid Academic Track',
    current_position: item.program.includes('Counseling') ? 'Christian Counselor & Community Health Worker' : 'Pastor & Ministry Coordinator',
    organization: `${item.city} Christian Assembly & Ministry Centre`,
    profession: item.program.includes('Counseling') ? 'Biblical Counseling & Family Therapy' : 'Pastoral Ministry & Theological Leadership',
    ministry: item.program.includes('Counseling') ? 'Pastoral Care & Youth Mentorship' : 'Evangelism, Church Planting & Discipleship',
    biography: `Conferred graduate from the Class of 2026 at Breakthrough International Theological College (BITC) Kericho Centre with a ${meta.awardLevel} in ${meta.programName}. Committed servant in ministerial impact and community transformation across Rift Valley, Kenya.`,
    achievements: [
      `Conferred ${meta.awardLevel} in ${meta.programName} (Class of 2026)`,
      'BITC Kericho Chapter Fellow',
      'Accredited Certificate Holder under BIBU Global Senate'
    ],
    chapter_id: 'ch-kericho',
    verification_status: 'Verified Alumni',
    privacy_status: 'Public Profile',
    featured: idx < 5,
    distinguished: idx === 0 || idx === 3,
    distinguished_category: item.program.includes('Counseling') ? 'Counseling' : 'Ministry Leadership',
    is_demo: false,
    created_at: '2026-11-28T10:00:00Z',
    updated_at: '2026-11-28T12:00:00Z',

    // CamelCase accessors
    alumniId,
    studentId,
    certificateNumber: certNo,
    firstName: item.firstName,
    middleName: item.middleName,
    lastName: item.lastName,
    fullName: item.fullName,
    countryCode: 'KE',
    graduationYear: 2026,
    graduationDate: '2026-11-28',
    programId: meta.programId,
    programName: meta.programName,
    qualificationLevel: meta.awardLevel
  };
});

// =========================================================================
// 5. KERICHO CHAPTER ALUMNI FELLOWSHIP
// =========================================================================
export const KERICHO_ALUMNI_CHAPTER: AlumniChapter = {
  id: 'ch-kericho',
  name: 'BIBU & BITC Kericho & South Rift Alumni Fellowship Chapter',
  country: 'Kenya',
  country_code: 'KE',
  city: 'Kericho Town',
  president_name: 'Rev. Kenneth Kipkorir Bett',
  president_alumni_id: 'BIBU-ALM-2026-KRC-001',
  secretary_name: 'Hillary Cheruiyot Langat',
  contact_email: 'kericho.chapter@bibu-edu.org',
  contact_phone: '+254 722 100 035',
  member_count: 56,
  established_year: 2026,
  description: 'Regional fellowship uniting pastors, counseling practitioners, and theological educators across Kericho, Bomet, and the South Rift region.',
  is_active: true,
  created_at: '2026-11-28T10:00:00Z',
  updated_at: '2026-11-28T12:00:00Z'
};
