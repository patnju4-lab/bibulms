import {
  GraduationCeremony,
  GraduationCandidate,
  GraduationBooklet,
  GraduationCertificateRecord
} from '../types/graduation';

// Official 2024 RPL Practitioners Graduation Ceremony
export const CEREMONY_2024_RPL: GraduationCeremony = {
  id: 'ceremony-2024-rpl-practitioners',
  graduationNumber: 'RPL Practitioners Graduation 2024',
  graduationCategory: 'RPL Practitioners Graduation 2024',
  academicYear: '2023/2024',
  graduationYear: 2024,
  graduationDate: '2024-09-28',
  graduationTime: '10:00 AM (EAT)',
  venue: 'BIBU Transnational Convocation Center & National TVET CDACC Accredited Centre',
  city: 'Nairobi',
  country: 'Kenya',
  theme: 'Recognition of Prior Learning (RPL) Practitioners Certification: Validating Competencies, Empowering Experience & Transforming Leadership',
  chiefGuest: 'Director & Evaluation Council of TVET CDACC Kenya & Alliance of Theological Schools (ATS)',
  chancellor: 'Dr. Michael C. Sterling, Th.D., D.Min.',
  viceChancellor: 'Prof. Dr. Patrick Njuguna, Ph.D., Th.D.',
  registrar: 'Rev. Dr. Sarah M. Jenkins, Th.D.',
  graduationCoordinator: 'Prof. Joseph K. Mutua, Ph.D. & RPL Assessment Council',
  status: 'Completed',
  logoUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600',
  bannerUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200',
  description: 'Special 2024 Convocation for Certified Recognition of Prior Learning (RPL) Practitioners trained and assessed under TVET CDACC Kenya in collaboration with Breakthrough International Bible University (BIBU) and the Alliance of Theological Schools (ATS), conferring 118 practitioner awards and citations across affiliate Bible colleges, seminaries, and theological institutions.',
  programmeSchedule: [
    { id: 'rpl-p1', order: 1, time: '08:30 AM', activity: 'Arrival of RPL Candidates, Assessors and Institutional Dignitaries', facilitator: 'RPL Protocol Marshals' },
    { id: 'rpl-p2', order: 2, time: '09:15 AM', activity: 'Academic & Institutional Procession of Affiliated Theological Schools', facilitator: 'Lead University Marshal' },
    { id: 'rpl-p3', order: 3, time: '09:40 AM', activity: 'Solemn Invocation, National Anthem & University Hymn', facilitator: 'Dean of Faculty' },
    { id: 'rpl-p4', order: 4, time: '10:00 AM', activity: 'Welcome & Institutional Overview of the TVET CDACC RPL Framework', facilitator: 'Rev. Dr. Sarah M. Jenkins (Registrar)' },
    { id: 'rpl-p5', order: 5, time: '10:30 AM', activity: 'Keynote Address on National Recognition of Prior Learning & Competency Standards', facilitator: 'TVET CDACC Kenya & ATS Leadership Council' },
    { id: 'rpl-p6', order: 6, time: '11:15 AM', activity: 'Presentation of RPL Candidates by Institutional Affiliates', facilitator: 'Deans & Institutional Representatives' },
    { id: 'rpl-p7', order: 7, time: '12:00 PM', activity: 'Conferment of RPL Practitioner Certifications & Degrees', facilitator: 'Chancellor Dr. Michael C. Sterling & Vice Chancellor Prof. Dr. Patrick Njuguna' },
    { id: 'rpl-p8', order: 8, time: '01:00 PM', activity: 'Practitioner Pledge, Ministerial Commissioning & Benediction', facilitator: 'Bishop Dr. John Miatu Thiga & University Senate' }
  ],
  photos: [
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800'
  ],
  videos: [],
  livestreamUrl: '',
  isDemo: false,
  createdAt: '2024-08-15T08:00:00Z',
  updatedAt: '2024-09-28T16:00:00Z'
};

const rplClearances = {
  academic: { department: 'Academic' as const, status: 'Completed' as const, clearedBy: 'Prof. Dr. Patrick Njuguna', clearedDate: '2024-09-18' },
  examination: { department: 'Examination' as const, status: 'Completed' as const, clearedBy: 'RPL Assessment Board', clearedDate: '2024-09-20' },
  finance: { department: 'Finance' as const, status: 'Completed' as const, clearedBy: 'University Bursar', clearedDate: '2024-09-22', feeAmountDue: 200, feeAmountPaid: 200 },
  library: { department: 'Library' as const, status: 'Completed' as const, clearedBy: 'Academic Resource Center', clearedDate: '2024-09-15' },
  studentAffairs: { department: 'Student Affairs' as const, status: 'Completed' as const, clearedBy: 'Dean of Students', clearedDate: '2024-09-24' },
  registrar: { department: 'Registrar' as const, status: 'Completed' as const, clearedBy: 'Rev. Dr. Sarah M. Jenkins', clearedDate: '2024-09-25' },
  graduationOffice: { department: 'Graduation Office' as const, status: 'Completed' as const, clearedBy: 'Prof. Joseph K. Mutua', clearedDate: '2024-09-26' }
};

export interface RawRPLCandidateItem {
  num: number;
  fullName: string;
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female';
  institution: string;
  programName?: string;
  awardLevel?: 'Certificate' | 'Diploma' | 'Bachelor' | 'Master' | 'Doctorate';
  academicAchievement?: string;
  academicHonors?: 'Distinction' | 'Merit' | 'Pass';
}

export const RAW_RPL_LIST: RawRPLCandidateItem[] = [
  { num: 1, fullName: 'Gacheru Njuguna Patrick', firstName: 'Patrick', lastName: 'Gacheru Njuguna', gender: 'Male', institution: 'Breakthrough International Bible College' },
  { num: 2, fullName: 'Francis Ndunda Mutisya', firstName: 'Francis', lastName: 'Ndunda Mutisya', gender: 'Male', institution: 'Empower Africa Bible Institute' },
  { num: 3, fullName: 'John Kisilu Kamusina', firstName: 'John', lastName: 'Kisilu Kamusina', gender: 'Male', institution: 'IBTI-Mataifa Bible School' },
  { num: 4, fullName: 'Anthony Kihuria Kariuki', firstName: 'Anthony', lastName: 'Kihuria Kariuki', gender: 'Male', institution: 'International Training Institute' },
  { num: 5, fullName: 'Lucas Burale Ogwa', firstName: 'Lucas', lastName: 'Burale Ogwa', gender: 'Male', institution: 'Breakthrough International Bible University' },
  { num: 6, fullName: 'David Mulele Busula', firstName: 'David', lastName: 'Mulele Busula', gender: 'Male', institution: 'Breakthrough International Bible University' },
  { num: 7, fullName: 'Irene Iminza Litswa', firstName: 'Irene', lastName: 'Iminza Litswa', gender: 'Female', institution: 'Breakthrough International Bible University' },
  { num: 8, fullName: 'Lucas Kagiri Wokabi', firstName: 'Lucas', lastName: 'Kagiri Wokabi', gender: 'Male', institution: 'International Training Institute' },
  { num: 9, fullName: 'Fredrick Gitaari Mwaniki', firstName: 'Fredrick', lastName: 'Gitaari Mwaniki', gender: 'Male', institution: 'Breakthrough International Bible University' },
  { num: 10, fullName: 'Thomas Tama Kigiri', firstName: 'Thomas', lastName: 'Tama Kigiri', gender: 'Male', institution: 'Mount Moriah International Bible University' },
  { num: 11, fullName: 'Peter Wambugu Mureithi', firstName: 'Peter', lastName: 'Wambugu Mureithi', gender: 'Male', institution: 'International Training Institute' },
  { num: 12, fullName: 'Rubanda Eric', firstName: 'Eric', lastName: 'Rubanda', gender: 'Male', institution: 'Breakthrough International Bible University' },
  { num: 13, fullName: 'Kariuki Henry Mburu', firstName: 'Henry', lastName: 'Kariuki Mburu', gender: 'Male', institution: 'More Than Conquerors Bible College' },
  { num: 14, fullName: 'Damaris Mary Njeri Kanyi', firstName: 'Damaris Mary', lastName: 'Njeri Kanyi', gender: 'Female', institution: 'Breakthrough International Bible University' },
  { num: 15, fullName: 'Kennedy Anaswa Musee', firstName: 'Kennedy', lastName: 'Anaswa Musee', gender: 'Male', institution: 'Angaza Bible and Training Institute' },
  { num: 16, fullName: 'James Maina Kagwe', firstName: 'James', lastName: 'Maina Kagwe', gender: 'Male', institution: 'Jesus School Of Ministry' },
  { num: 17, fullName: 'Simon Mwangi Macharia', firstName: 'Simon', lastName: 'Mwangi Macharia', gender: 'Male', institution: 'Well of Wisdom College' },
  { num: 18, fullName: 'King\'ori Nahashon Thuita', firstName: 'Nahashon', lastName: 'King\'ori Thuita', gender: 'Male', institution: 'Breakthrough International Bible College' },
  { num: 19, fullName: 'Mwangi Raphael Njogu', firstName: 'Raphael', lastName: 'Mwangi Njogu', gender: 'Male', institution: 'Breakthrough International Bible College' },
  { num: 20, fullName: 'Miano Stephen Murimi', firstName: 'Stephen', lastName: 'Miano Murimi', gender: 'Male', institution: 'Trinity Gospel Bible Institute' },
  { num: 21, fullName: 'David Njeru Ezekiel', firstName: 'David', lastName: 'Njeru Ezekiel', gender: 'Male', institution: 'Breakthrough International Bible College' },
  { num: 22, fullName: 'Anabel Anagard Njiiri', firstName: 'Anabel', lastName: 'Anagard Njiiri', gender: 'Female', institution: 'Logos International Bible University / Libu Training Institute' },
  { num: 23, fullName: 'Charles Nduiga Mwangi', firstName: 'Charles', lastName: 'Nduiga Mwangi', gender: 'Male', institution: 'KCTC (Kingdom Calvary Theological College)' },
  { num: 24, fullName: 'Paul Macharia Gathogo', firstName: 'Paul', lastName: 'Macharia Gathogo', gender: 'Male', institution: 'KCTC (Kingdom Calvary Theological College)' },
  { num: 25, fullName: 'Joseph Waweru Migwi', firstName: 'Joseph', lastName: 'Waweru Migwi', gender: 'Male', institution: 'KCTC (Kingdom Calvary Theological College)' },
  { num: 26, fullName: 'Zadok Mwangi Nduiga', firstName: 'Zadok', lastName: 'Mwangi Nduiga', gender: 'Male', institution: 'KCTC (Kingdom Calvary Theological College)' },
  { num: 27, fullName: 'Elizabeth Wanjiku Muturi', firstName: 'Elizabeth', lastName: 'Wanjiku Muturi', gender: 'Female', institution: 'KCTC (Kingdom Calvary Theological College)' },
  { num: 28, fullName: 'Alice Mukiri Kiogora', firstName: 'Alice', lastName: 'Mukiri Kiogora', gender: 'Female', institution: 'KCTC (Kingdom Calvary Theological College)' },
  { num: 29, fullName: 'Isaac Kireru Mwangi', firstName: 'Isaac', lastName: 'Kireru Mwangi', gender: 'Male', institution: 'Breakthrough International Bible College' },
  { num: 30, fullName: 'Evans Keitany Chepkwony', firstName: 'Evans', lastName: 'Keitany Chepkwony', gender: 'Male', institution: 'Breakthrough International Bible College' },
  { num: 31, fullName: 'Peter Muriithi Elisha', firstName: 'Peter', lastName: 'Muriithi Elisha', gender: 'Male', institution: 'Frontline Leadership Institute' },
  { num: 32, fullName: 'Tonnie Kibet', firstName: 'Tonnie', lastName: 'Kibet', gender: 'Male', institution: 'Breakthrough International Bible University' },
  { num: 33, fullName: 'Simion Sigey', firstName: 'Simion', lastName: 'Sigey', gender: 'Male', institution: 'Breakthrough International Bible University' },
  { num: 34, fullName: 'Gilbert Butichi Adagala', firstName: 'Gilbert', lastName: 'Butichi Adagala', gender: 'Male', institution: 'More Than Conquerors Bible College' },
  { num: 35, fullName: 'Osewe Elijah Houstma', firstName: 'Elijah', lastName: 'Osewe Houstma', gender: 'Male', institution: 'Angaza Bible and Training Institute' },
  { num: 36, fullName: 'Lucia G. Kageni', firstName: 'Lucia', lastName: 'G. Kageni', gender: 'Female', institution: 'Advanced Leadership Bible Training And Psychological Counseling Institute' },
  { num: 37, fullName: 'Susan N. Wangui', firstName: 'Susan', lastName: 'N. Wangui', gender: 'Female', institution: 'Advanced Leadership Bible Training And Psychological Counseling Institute' },
  { num: 38, fullName: 'Ruth Mwikali Kioko', firstName: 'Ruth', lastName: 'Mwikali Kioko', gender: 'Female', institution: 'Advanced Leadership And Bible Training And Psychological Counseling Institute' },
  { num: 39, fullName: 'Erastus Ochieng', firstName: 'Erastus', lastName: 'Ochieng', gender: 'Male', institution: 'Christlike Theology Training College' },
  { num: 40, fullName: 'Peter Mwangi Nyambura', firstName: 'Peter', lastName: 'Mwangi Nyambura', gender: 'Male', institution: 'Leadership Training International Bible Institute' },
  { num: 41, fullName: 'Jane Wambui Gidraph', firstName: 'Jane', lastName: 'Wambui Gidraph', gender: 'Female', institution: 'Breakthrough International Bible University' },
  { num: 42, fullName: 'Rumishaeli Obed Lyimo', firstName: 'Rumishaeli', lastName: 'Obed Lyimo', gender: 'Male', institution: 'Breakthrough International Bible University' },
  { num: 43, fullName: 'John Ngugi Ndiki', firstName: 'John', lastName: 'Ngugi Ndiki', gender: 'Male', institution: 'Wellspring Theology and Technical Training College' },
  { num: 44, fullName: 'Antony Mwangi Wanjau', firstName: 'Antony', lastName: 'Mwangi Wanjau', gender: 'Male', institution: 'Equipped Believers Bible Institute' },
  { num: 45, fullName: 'Williamson Kaguna Mwai', firstName: 'Williamson', lastName: 'Kaguna Mwai', gender: 'Male', institution: 'Kingdom Impartation Training Institute' },
  { num: 46, fullName: 'Fredrick Githitu Nganga', firstName: 'Fredrick', lastName: 'Githitu Nganga', gender: 'Male', institution: 'More Than Conquerors Bible College' },
  { num: 47, fullName: 'Hannington Mutuku Mutua', firstName: 'Hannington', lastName: 'Mutuku Mutua', gender: 'Male', institution: 'Transforming Lives School of Theology' },
  { num: 48, fullName: 'Joseph Mutunga Mutua', firstName: 'Joseph', lastName: 'Mutunga Mutua', gender: 'Male', institution: 'Breakthrough International Bible University' },
  { num: 49, fullName: 'Grace Njeri Ndungu', firstName: 'Grace', lastName: 'Njeri Ndungu', gender: 'Female', institution: 'Breakthrough International Bible College' },
  { num: 50, fullName: 'Winfred Wanjugu Waithaka', firstName: 'Winfred', lastName: 'Wanjugu Waithaka', gender: 'Female', institution: 'Breakthrough International Bible University' },
  { num: 51, fullName: 'Raphael Muinde Kisembi', firstName: 'Raphael', lastName: 'Muinde Kisembi', gender: 'Male', institution: 'Breakthrough International Bible University' },
  { num: 52, fullName: 'John Gitau Thotho', firstName: 'John', lastName: 'Gitau Thotho', gender: 'Male', institution: 'Breakthrough International Bible University' },
  { num: 53, fullName: 'Hellen Wanjeri Musyoka', firstName: 'Hellen', lastName: 'Wanjeri Musyoka', gender: 'Female', institution: 'Biblical Leadership Training Center' },
  { num: 54, fullName: 'Matthew Musyoka', firstName: 'Matthew', lastName: 'Musyoka', gender: 'Male', institution: 'Biblical Leadership Training Center' },
  { num: 55, fullName: 'Thomas Ngumu Nzau', firstName: 'Thomas', lastName: 'Ngumu Nzau', gender: 'Male', institution: 'Trinity Gospel Bible Institute' },
  { num: 56, fullName: 'Philip Muchora Gichohi', firstName: 'Philip', lastName: 'Muchora Gichohi', gender: 'Male', institution: 'Trinity Gospel Bible Institute' },
  { num: 57, fullName: 'Julius Mutia Kaliti', firstName: 'Julius', lastName: 'Mutia Kaliti', gender: 'Male', institution: 'Breakthrough International Bible University' },
  { num: 58, fullName: 'Didacus Onyango Sijeny', firstName: 'Didacus', lastName: 'Onyango Sijeny', gender: 'Male', institution: 'Biblical Leadership Training Centre' },
  { num: 59, fullName: 'Gilbert Kipkosgei Kurgat', firstName: 'Gilbert', lastName: 'Kipkosgei Kurgat', gender: 'Male', institution: 'Breakthrough International Bible University' },
  { num: 60, fullName: 'Peter Kapanga', firstName: 'Peter', lastName: 'Kapanga', gender: 'Male', institution: 'Biblical Leadership Training Center' },
  { num: 61, fullName: 'Amos N. Nzioka', firstName: 'Amos', lastName: 'N. Nzioka', gender: 'Male', institution: 'International Training Institute (ITI)' },
  { num: 62, fullName: 'Joram Kimoi Waichahe', firstName: 'Joram', lastName: 'Kimoi Waichahe', gender: 'Male', institution: 'More Than Conquerors' },
  { num: 63, fullName: 'Fredrick Nganga', firstName: 'Fredrick', lastName: 'Nganga', gender: 'Male', institution: 'More Than Conquerors Bible College' },
  { num: 64, fullName: 'Joshua Kamau Gitukia', firstName: 'Joshua', lastName: 'Kamau Gitukia', gender: 'Male', institution: 'New Life Theological Seminary' },
  { num: 65, fullName: 'Naomi Wanjiru Njuguna', firstName: 'Naomi', lastName: 'Wanjiru Njuguna', gender: 'Female', institution: 'GTNM School Of Ministry' },
  { num: 66, fullName: 'Stanley Karanja Kamau', firstName: 'Stanley', lastName: 'Karanja Kamau', gender: 'Male', institution: 'Breakthrough International Bible University' },
  { num: 67, fullName: 'Wycliffe Owino Onjala', firstName: 'Wycliffe', lastName: 'Owino Onjala', gender: 'Male', institution: 'Advanced Leadership Bible Training And Psychological Counseling Institute' },
  { num: 68, fullName: 'Gideon Mwandango Wycliffe', firstName: 'Gideon', lastName: 'Mwandango Wycliffe', gender: 'Male', institution: 'International University / Manna Bible Institute / NPBC' },
  { num: 69, fullName: 'Joseph K. Mutua', firstName: 'Joseph', lastName: 'K. Mutua', gender: 'Male', institution: 'Mount Moriah International University' },
  { num: 70, fullName: 'Stella N. Kilonzo', firstName: 'Stella', lastName: 'N. Kilonzo', gender: 'Female', institution: 'Mount Moriah International University' },
  { num: 71, fullName: 'Simon Sinkeet Karei', firstName: 'Simon', lastName: 'Sinkeet Karei', gender: 'Male', institution: 'International Training Institute (ITI)' },
  { num: 72, fullName: 'Alphonce Musyoki Kyengo', firstName: 'Alphonce', lastName: 'Musyoki Kyengo', gender: 'Male', institution: 'Breakthrough International Bible University' },
  { num: 73, fullName: 'Tabitha T. Muita', firstName: 'Tabitha', lastName: 'T. Muita', gender: 'Female', institution: 'Breakthrough International Bible University' },
  { num: 74, fullName: 'Simon Kariuki Karanja', firstName: 'Simon', lastName: 'Kariuki Karanja', gender: 'Male', institution: 'FIBU Institute of Theological Training' },
  { num: 75, fullName: 'Joseph Mureithi Rugah', firstName: 'Joseph', lastName: 'Mureithi Rugah', gender: 'Male', institution: 'Logos International Bible University' },
  { num: 76, fullName: 'Ezine Enos Musatsili', firstName: 'Ezine', lastName: 'Enos Musatsili', gender: 'Male', institution: 'Breakthrough International Bible University' },
  { num: 77, fullName: 'Eliphas Mugao Mitugo', firstName: 'Eliphas', lastName: 'Mugao Mitugo', gender: 'Male', institution: 'Breakthrough International Bible University' },
  { num: 78, fullName: 'Justus Mutunga', firstName: 'Justus', lastName: 'Mutunga', gender: 'Male', institution: 'Impartation Leadership Bible Training Institute' },
  { num: 79, fullName: 'Francis Mwangi Kariuki', firstName: 'Francis', lastName: 'Mwangi Kariuki', gender: 'Male', institution: 'Kingdom Calvary Theological College (KCTC)' },
  { num: 80, fullName: 'Rodgers Shijenje Lukano', firstName: 'Rodgers', lastName: 'Shijenje Lukano', gender: 'Male', institution: 'Carlile College' },
  { num: 81, fullName: 'Patrick Kariuki Mburu', firstName: 'Patrick', lastName: 'Kariuki Mburu', gender: 'Male', institution: 'Boulema Training Institute' },
  { num: 82, fullName: 'Benson Kiptoo Chemao', firstName: 'Benson', lastName: 'Kiptoo Chemao', gender: 'Male', institution: 'Kingdom Theological University' },
  { num: 83, fullName: 'Dorcas Kibathi', firstName: 'Dorcas', lastName: 'Kibathi', gender: 'Female', institution: 'Kingdom Theological University' },
  { num: 84, fullName: 'Samuel Njogu Mbae', firstName: 'Samuel', lastName: 'Njogu Mbae', gender: 'Male', institution: 'Kingdom Theological University' },
  { num: 85, fullName: 'Benson Ekeno Ekuwom', firstName: 'Benson', lastName: 'Ekeno Ekuwom', gender: 'Male', institution: 'Lodwar School of Mission' },
  { num: 86, fullName: 'Joseph Njoroge', firstName: 'Joseph', lastName: 'Njoroge', gender: 'Male', institution: 'Word of Faith Bible College' },
  { num: 87, fullName: 'Robin Sinokho Makokha', firstName: 'Robin', lastName: 'Sinokho Makokha', gender: 'Male', institution: 'Breakthrough International Bible University' },
  { num: 88, fullName: 'Teresa Mumbi Wambui', firstName: 'Teresa', lastName: 'Mumbi Wambui', gender: 'Female', institution: 'Impartation Leadership Bible Training Institute' },
  { num: 89, fullName: 'Daniel Kung\'u Maina', firstName: 'Daniel', lastName: 'Kung\'u Maina', gender: 'Male', institution: 'Impartation Leadership Bible Training Institute' },
  { num: 90, fullName: 'John Kuria Thuo', firstName: 'John', lastName: 'Kuria Thuo', gender: 'Male', institution: 'Yeshua Bible Training College' },
  { num: 91, fullName: 'Benson Mbuvi Mutysia', firstName: 'Benson', lastName: 'Mbuvi Mutysia', gender: 'Male', institution: 'Biblical Leadership Training Institute' },
  { num: 92, fullName: 'Stephen Wanjohi Macharia', firstName: 'Stephen', lastName: 'Wanjohi Macharia', gender: 'Male', institution: 'Boulema Training Institute' },
  { num: 93, fullName: 'Lillian Wangui Wanjohi', firstName: 'Lillian', lastName: 'Wangui Wanjohi', gender: 'Female', institution: 'Boulema Training Institute' },
  { num: 94, fullName: 'Mburu Benson Mwangi', firstName: 'Benson', lastName: 'Mburu Mwangi', gender: 'Male', institution: 'Boulema Training Institute' },
  { num: 95, fullName: 'John Mwangi Macharia', firstName: 'John', lastName: 'Mwangi Macharia', gender: 'Male', institution: 'Boulema Training Institute' },
  { num: 96, fullName: 'Duncan Kiarie Muraguri', firstName: 'Duncan', lastName: 'Kiarie Muraguri', gender: 'Male', institution: 'Breakthrough International Bible University' },
  { num: 97, fullName: 'Wilfred Kimani Karume', firstName: 'Wilfred', lastName: 'Kimani Karume', gender: 'Male', institution: 'Breakthrough International Bible University' },
  { num: 98, fullName: 'Musungu Peter', firstName: 'Peter', lastName: 'Musungu', gender: 'Male', institution: 'Breakthrough International Bible University', programName: 'Bachelor of Theology & RPL Practitioner Certification', awardLevel: 'Bachelor', academicAchievement: 'Degree - Bachelor of Theology & Certified RPL Practitioner' },
  { num: 99, fullName: 'David Ndegwa Gichuki', firstName: 'David', lastName: 'Ndegwa Gichuki', gender: 'Male', institution: 'Breakthrough International Bible University' },
  { num: 100, fullName: 'Hudson Achangu Manyuru', firstName: 'Hudson', lastName: 'Achangu Manyuru', gender: 'Male', institution: 'Breakthrough International Bible College' },
  { num: 101, fullName: 'Job Alushula', firstName: 'Job', lastName: 'Alushula', gender: 'Male', institution: 'Breakthrough International Bible University' },
  { num: 102, fullName: 'Genevieve Sikolia', firstName: 'Genevieve', lastName: 'Sikolia', gender: 'Female', institution: 'Mount Moriah International University' },
  { num: 103, fullName: 'Gideon Munzyu Muia', firstName: 'Gideon', lastName: 'Munzyu Muia', gender: 'Male', institution: 'Global Grace Commission College' },
  { num: 104, fullName: 'Joseph Maithia', firstName: 'Joseph', lastName: 'Maithia', gender: 'Male', institution: 'Breakthrough International Bible University' },
  { num: 105, fullName: 'Kibet Chebii', firstName: 'Kibet', lastName: 'Chebii', gender: 'Male', institution: 'Breakthrough International Bible University' },
  { num: 106, fullName: 'Joseph Njoroge Mbugua', firstName: 'Joseph', lastName: 'Njoroge Mbugua', gender: 'Male', institution: 'Word of Faith Bible College' },
  { num: 107, fullName: 'Symon Njagi Gichira', firstName: 'Symon', lastName: 'Njagi Gichira', gender: 'Male', institution: 'Breakthrough International Bible University' },
  { num: 108, fullName: 'Francis Monanti Akanga', firstName: 'Francis', lastName: 'Monanti Akanga', gender: 'Male', institution: 'Breakthrough International Bible College' },
  { num: 109, fullName: 'Shadrack Mucembi Kirema', firstName: 'Shadrack', lastName: 'Mucembi Kirema', gender: 'Male', institution: 'Biblical Leadership Training Centre' },
  { num: 110, fullName: 'Agnes Nduku Munyao', firstName: 'Agnes', lastName: 'Nduku Munyao', gender: 'Female', institution: 'Breakthrough International Bible University' },
  { num: 111, fullName: 'Richard Agoswa Shimanyano', firstName: 'Richard', lastName: 'Agoswa Shimanyano', gender: 'Male', institution: 'Kingdom Calvary Theological College' },
  { num: 112, fullName: 'Bsp Dr John Miatu Thiga', firstName: 'John', lastName: 'Miatu Thiga', gender: 'Male', institution: 'PAC University / NPBC', programName: 'Doctor of Divinity & Senior RPL Practitioner Assessor', awardLevel: 'Doctorate', academicAchievement: 'Doctor of Divinity & Senior RPL Practitioner Assessor' },
  { num: 113, fullName: 'Daniel Maingi Mugwe', firstName: 'Daniel', lastName: 'Maingi Mugwe', gender: 'Male', institution: 'Breakthrough International Bible University' },
  { num: 114, fullName: 'Philip Nthuki Peter', firstName: 'Philip', lastName: 'Nthuki Peter', gender: 'Male', institution: 'Generational Faith Empowerment Center' },
  { num: 115, fullName: 'Alliance of Theological Schools (ATS)', firstName: 'Alliance of Theological Schools', lastName: 'ATS Institutional Accreditation', gender: 'Male', institution: 'Alliance of Theological Schools', programName: 'Institutional Charter & Accreditation Citation', awardLevel: 'Certificate', academicAchievement: 'ATS Institutional Accreditation & Quality Assurance Citation' },
  { num: 116, fullName: 'Recognition of Prior Learning Practitioners Council (TVET CDACC)', firstName: 'TVET CDACC Kenya', lastName: 'RPL Certification Framework', gender: 'Male', institution: 'Recognition of Prior Learning Practitioners Training under TVET CDACC Kenya', programName: 'National RPL Framework Accreditation & Standards Citation', awardLevel: 'Certificate', academicAchievement: 'TVET CDACC Kenya National RPL Framework Certification' },
  { num: 117, fullName: 'Julia Wanjira Mwangi', firstName: 'Julia', lastName: 'Wanjira Mwangi', gender: 'Female', institution: 'Breakthrough International Bible University' },
  { num: 118, fullName: 'Catherine Wangechi Kungu', firstName: 'Catherine', lastName: 'Wangechi Kungu', gender: 'Female', institution: 'Breakthrough International Bible University' }
];

export const RPL_2024_CANDIDATES: GraduationCandidate[] = RAW_RPL_LIST.map((cand) => {
  const padNum = String(cand.num).padStart(3, '0');
  const studentId = `BIBU-2024-RPL-${padNum}`;
  const admissionNumber = `BIBU/ADM/RPL/2024/${padNum}`;
  const defaultProgram = 'Recognition of Prior Learning (RPL) Practitioner Certification';
  const programName = cand.programName || defaultProgram;
  const awardLevel = cand.awardLevel || 'Certificate';
  const academicAchievement = cand.academicAchievement || 'Certified RPL Practitioner & Assessor (TVET CDACC Kenya / BIBU)';

  return {
    id: `cand-2024-rpl-${padNum}`,
    studentId,
    admissionNumber,
    fullName: cand.fullName,
    firstName: cand.firstName,
    lastName: cand.lastName,
    gender: cand.gender,
    nationality: 'Kenyan',
    country: 'Kenya',
    city: 'Nairobi',
    schoolId: `sch-inst-${cand.institution.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    schoolName: cand.institution,
    programId: 'prog-rpl-practitioner',
    programName,
    awardLevel,
    specialization: 'Prior Learning Assessment, Competency Validation & Theological Mentorship',
    institution: cand.institution,
    graduationCategory: 'RPL Practitioners Graduation 2024',
    academicAchievement,
    studyMode: 'Competency-Based Assessment & RPL Certification',
    graduationYear: 2024,
    ceremonyId: 'ceremony-2024-rpl-practitioners',
    ceremonyNumber: 'RPL Practitioners Graduation 2024',
    status: 'Conferred Graduate',
    clearanceProgress: 100,
    clearances: rplClearances,
    graduationFeeStatus: 'Paid',
    graduationFeeAmount: 200,
    graduationFeePaid: 200,
    finalGpa: 3.85,
    academicHonors: cand.academicHonors || (cand.num % 4 === 0 ? 'Distinction' : 'Merit'),
    certificateNumber: `BIBU-CERT-RPL-2024-${padNum}`,
    transcriptNumber: `BIBU-TR-RPL-2024-${padNum}`,
    bookletNumber: `BK-RPL-2024-${padNum}`,
    conferralDate: '2024-09-28',
    isAlumniMigrated: true,
    isDemo: false,
    createdAt: '2024-08-15T00:00:00Z',
    updatedAt: '2024-09-28T00:00:00Z'
  };
});

// Official RPL Convocation Booklet
export const RPL_2024_BOOKLET: GraduationBooklet = {
  id: 'booklet-2024-rpl-practitioners',
  ceremonyId: 'ceremony-2024-rpl-practitioners',
  graduationCategory: 'RPL Practitioners Graduation 2024',
  title: 'Official Convocation Programme & Graduands Roll: RPL Practitioners Graduation 2024',
  academicYear: '2023/2024',
  edition: 'Official 2024 RPL Convocation Edition (118 Certified Practitioners)',
  theme: 'Recognition of Prior Learning (RPL) Practitioners Certification: Validating Competencies, Empowering Experience & Transforming Leadership',
  coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200',
  status: 'Published',
  publishedDate: '2024-09-28',
  chancellorMessage: {
    authorName: 'Dr. Michael C. Sterling, Th.D., D.Min.',
    authorTitle: 'President & Chancellor, Breakthrough International Bible University',
    messageTitle: 'Conferment of Recognition of Prior Learning (RPL) Practitioner Certifications',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
    signatureText: 'Dr. Michael C. Sterling, Chancellor',
    messageContent: [
      'It is with profound honor that we celebrate this landmark convocation: conferring and certifying 118 Recognition of Prior Learning (RPL) Practitioners.',
      'By validating decades of pastoral commitment, community service, and theological stewardship, we affirm that knowledge gained through lived ministry experience is worthy of academic recognition before God and humanity.',
      'Breakthrough International Bible University, in strategic alignment with national qualifications and the Alliance of Theological Schools, salutes these dedicated practitioners.'
    ]
  },
  viceChancellorMessage: {
    authorName: 'Prof. Dr. Patrick Njuguna, Ph.D., Th.D.',
    authorTitle: 'Vice Chancellor & Chief Academic Officer',
    messageTitle: 'Empowering Ministry Experience through TVET CDACC Competency Frameworks',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    signatureText: 'Prof. Dr. Patrick Njuguna, Vice Chancellor',
    messageContent: [
      'Our collaboration under the TVET CDACC Kenya RPL framework and the Alliance of Theological Schools (ATS) marks a revolutionary step in competency-based education.',
      '118 practitioners from affiliate institutions across Kenya and beyond have demonstrated mastery, portfolio excellence, and leadership readiness.',
      'We commission each graduate to continue elevating the standard of ministerial training, prior learning evaluation, and community impact.'
    ]
  },
  registrarMessage: {
    authorName: 'Rev. Dr. Sarah M. Jenkins, Th.D.',
    authorTitle: 'University Registrar',
    messageTitle: 'Official Certification & Roll of Conferred RPL Graduands',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    signatureText: 'Rev. Dr. Sarah M. Jenkins, Registrar',
    messageContent: [
      'The Office of the University Registrar certifies that all 118 candidates published in this official roll have satisfied the assessment, portfolio validation, and institutional standards required by the University Senate and TVET CDACC Kenya.',
      'All certificates are officially gazetted, digitally verifiable, and permanently cataloged in the University Academic Archives.'
    ]
  },
  universityProfile: {
    history: 'Breakthrough International Bible University is a Nonprofit 501(c)(3) Tax Exempted Religious Corporation, Licensed to Operate as a Private Post-Secondary Institution by the State of Arizona (USA). In Kenya and East Africa, BIBU collaborates with TVET CDACC Kenya and the Alliance of Theological Schools (ATS) to provide prior learning assessment and transnational ministerial education.',
    vision: 'To validate, equip, and commission kingdom leaders whose proven competencies and spiritual maturity transform communities worldwide.',
    mission: 'Providing accessible competency-based recognition of prior learning, rigorous theological scholarship, and certified assessor training.',
    coreValues: [
      'Biblical Authority and Integrity in Leadership',
      'Validation of Experiential Wisdom and Ministerial Competence',
      'Excellence in National and Transnational Accreditation Standards',
      'Holistic Service to the Church and Global Community'
    ],
    accreditationStatement: 'Assessed under the Recognition of Prior Learning Framework of TVET CDACC Kenya in partnership with Breakthrough International Bible University and the Alliance of Theological Schools (ATS).',
    institutionsSummary: 'Participating affiliate institutions include Breakthrough International Bible University, Breakthrough International Bible College, Empower Africa Bible Institute, IBTI-Mataifa Bible School, International Training Institute (ITI), Kingdom Calvary Theological College (KCTC), More Than Conquerors Bible College, Angaza Bible Institute, Logos International Bible University, Boulema Training Institute, Biblical Leadership Training Centre, Advanced Leadership Bible Training Institute, and partner colleges.'
  },
  facultyBoard: [
    { name: 'Dr. Michael C. Sterling, Th.D., D.Min.', qualifications: 'Th.D., D.Min.', role: 'Chancellor & President', departmentOrSchool: 'University Senate' },
    { name: 'Prof. Dr. Patrick Njuguna, Ph.D., Th.D.', qualifications: 'Ph.D., Th.D.', role: 'Vice Chancellor', departmentOrSchool: 'Academic Council' },
    { name: 'Rev. Dr. Sarah M. Jenkins, Th.D.', qualifications: 'Th.D.', role: 'University Registrar', departmentOrSchool: 'Office of Academic Affairs' },
    { name: 'Prof. Joseph K. Mutua, Ph.D.', qualifications: 'Ph.D.', role: 'Graduation Coordinator & RPL Assessor', departmentOrSchool: 'Convocation Directorate' },
    { name: 'Bishop Dr. John Miatu Thiga', qualifications: 'D.D., Ph.D.', role: 'Lead RPL Assessor & ATS Liaison', departmentOrSchool: 'Alliance of Theological Schools' }
  ],
  customProgrammeSchedule: [
    { id: 'b-rpl-1', order: 1, time: '08:30 AM', activity: 'Arrival & Assembly of Graduands and Dignitaries', facilitator: 'Chief Protocol Officer' },
    { id: 'b-rpl-2', order: 2, time: '09:15 AM', activity: 'Academic Procession of Affiliated Theological Schools', facilitator: 'University Senate Marshal' },
    { id: 'b-rpl-3', order: 3, time: '10:00 AM', activity: 'Welcome & Registrar Certification Address', facilitator: 'Rev. Dr. Sarah M. Jenkins (Registrar)' },
    { id: 'b-rpl-4', order: 4, time: '10:30 AM', activity: 'TVET CDACC Kenya National RPL Framework Keynote', facilitator: 'Director TVET CDACC Council' },
    { id: 'b-rpl-5', order: 5, time: '11:15 AM', activity: 'Presentation of RPL Candidates by Institutional Heads', facilitator: 'Faculty Deans' },
    { id: 'b-rpl-6', order: 6, time: '12:00 PM', activity: 'Conferment of RPL Practitioner Certifications & Degrees', facilitator: 'Chancellor & Vice Chancellor' },
    { id: 'b-rpl-7', order: 7, time: '01:00 PM', activity: 'Practitioners Oath & Commissioning Benediction', facilitator: 'Bishop Dr. John Miatu Thiga & Presiding Council' }
  ],
  awards: [
    {
      id: 'aw-rpl-01',
      awardTitle: 'RPL Excellence & Institutional Pioneering Award',
      awardCategory: 'Ministry Leadership',
      candidateId: 'cand-2024-rpl-112',
      studentName: 'Bishop Dr. John Miatu Thiga',
      programName: 'Doctor of Divinity & Senior RPL Practitioner Assessor',
      schoolName: 'PAC University / NPBC & ATS',
      citation: 'For exemplary statesmanship and leadership in advancing the Recognition of Prior Learning framework across African theological institutions.',
      presentedBy: 'Dr. Michael C. Sterling, Chancellor',
      ceremonyId: 'ceremony-2024-rpl-practitioners'
    },
    {
      id: 'aw-rpl-02',
      awardTitle: "Vice Chancellor's RPL Meritorious Service Award",
      awardCategory: 'Academic Excellence',
      candidateId: 'cand-2024-rpl-001',
      studentName: 'Gacheru Njuguna Patrick',
      programName: 'Recognition of Prior Learning (RPL) Practitioner Certification',
      schoolName: 'Breakthrough International Bible College',
      citation: 'For leading institutional coordination, candidate mentoring, and adherence to TVET CDACC assessment benchmarks.',
      presentedBy: 'Prof. Dr. Patrick Njuguna, Vice Chancellor',
      ceremonyId: 'ceremony-2024-rpl-practitioners'
    }
  ],
  generatedAt: '2024-09-28T10:00:00Z',
  generatedBy: 'Rev. Dr. Sarah M. Jenkins (Registrar)',
  lastEditedBy: 'Registrar Office',
  isDemo: false
};

// Official RPL Certificate Records
export const RPL_2024_CERTIFICATES: GraduationCertificateRecord[] = RPL_2024_CANDIDATES.map((cand) => ({
  id: `cert-rec-${cand.id}`,
  certificateNumber: cand.certificateNumber || `BIBU-CERT-RPL-2024-${cand.id}`,
  studentId: cand.studentId,
  candidateId: cand.id,
  fullName: cand.fullName,
  studentName: cand.fullName,
  degreeTitle: cand.programName,
  programName: cand.programName,
  schoolName: cand.schoolName,
  awardLevel: cand.awardLevel,
  honors: cand.academicHonors,
  graduationDate: '2024-09-28',
  graduationYear: 2024,
  ceremonyId: 'ceremony-2024-rpl-practitioners',
  ceremonyNumber: 'RPL Practitioners Graduation 2024',
  graduationCategory: 'RPL Practitioners Graduation 2024',
  status: 'Conferred & Valid',
  issuedDate: '2024-09-28',
  conferralDate: '2024-09-28',
  verificationCode: `VRF-2024-RPL-${cand.studentId.split('-').pop() || '001'}-VALID`,
  chancellorName: 'Dr. Michael C. Sterling, Th.D., D.Min.',
  viceChancellorName: 'Prof. Dr. Patrick Njuguna, Ph.D., Th.D.',
  registrarName: 'Rev. Dr. Sarah M. Jenkins, Th.D.',
  registrarApprovalDate: '2024-09-25',
  isDemo: false
}));
