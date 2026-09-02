import {
  School,
  Program,
  Course,
  Module,
  Assignment,
  Examination,
  GradeRecord,
  Certificate,
  LibraryResource,
  Announcement,
  User,
  Application,
  RPLApplication,
  FinancialTransaction,
  SupportTicket,
  UniversityInfo,
  Invoice,
} from '../types';

export const UNIVERSITY_INFO: UniversityInfo = {
  name: 'Breakthrough International Bible University',
  shortName: 'BIBU',
  tagline: 'Equipping Kingdom Leaders, Pastors, and Scholars Across the Nations',
  motto: 'Veritas, Ministerium, et Excellentia in Christo',
  location: 'Phoenix, Arizona, USA',
  address: '2400 W. University Parkway, Suite 500, Phoenix, AZ 85034, USA',
  email: 'admissions@bibu-edu.org',
  registrarEmail: 'registrar@bibu-edu.org',
  phone: '+1 (602) 845-9200',
  chancellor: 'Dr. Michael C. Sterling, Th.D., D.Min.',
  chancellorTitle: 'President & Chancellor',
  registrar: 'Rev. Dr. Sarah M. Jenkins, Th.D.',
  accreditation: 'Accredited by the International Commission for Christian Academic Standards (ICCAS) & Certified Member of Global Theological Education Network.',
  established: 1998,
  activeCountries: 64,
  alumniCount: 14500,
  currentEnrollment: 3820,
  heroHeadline: 'Equipping Called Ministers, Pastors & Scholars for Global Kingdom Impact',
  heroSubtitle: 'A premier Spirit-filled theological university in Phoenix, Arizona, offering flexible online accredited degrees, advanced ministerial ordination tracks, and prior ministry learning credit.',
  announcementTicker: 'Fall 2026 Admissions & RPL Prior Learning Assessment Applications are now open • Apply online today!',
};

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-student-1',
    name: 'Pastor David Emmanuel',
    email: 'david.emmanuel@student.bibu-edu.org',
    password: 'password123',
    role: 'student',
    title: 'Senior Pastor, Grace Covenant Church',
    country: 'United States',
    studentId: 'BIBU-2024-ST-7492',
    programId: 'prog-bth',
    programName: 'Bachelor of Theology (B.Th)',
    enrolledCourseIds: ['crs-herm-301', 'crs-theo-201', 'crs-past-401'],
    schoolId: 'sch-theology',
    currentSemester: 'Fall 2026',
    admissionYear: 2024,
    gpa: 3.84,
    creditsEarned: 78,
    totalRequiredCredits: 120,
    financialBalance: 450,
    currency: 'USD',
    bio: 'Serving in active pastoral ministry for 8 years, completing B.Th to deepen expository preaching and pastoral counseling skills.',
    ministryAffiliation: 'Grace Covenant Fellowship, Phoenix, AZ',
    status: 'active',
  },
  {
    id: 'usr-student-2',
    name: 'Sister Hannah Kyomugisha',
    email: 'hannah.k@student.bibu-edu.org',
    password: 'password123',
    role: 'student',
    title: 'Global Outreach Coordinator',
    country: 'Uganda',
    studentId: 'BIBU-2025-ST-8812',
    programId: 'prog-mcm',
    programName: 'Master of Christian Ministry (M.C.M)',
    enrolledCourseIds: ['crs-past-401', 'crs-miss-302'],
    schoolId: 'sch-ministry',
    currentSemester: 'Fall 2026',
    admissionYear: 2025,
    gpa: 3.92,
    creditsEarned: 24,
    totalRequiredCredits: 48,
    financialBalance: 0,
    currency: 'USD',
    bio: 'Focusing on cross-cultural evangelism and women in ministry leadership across East Africa.',
    ministryAffiliation: 'Harvest Assemblies International, Kampala',
    status: 'active',
  },
  {
    id: 'usr-faculty-1',
    name: 'Dr. Thomas E. Wright, Ph.D., D.D.',
    email: 't.wright@faculty.bibu-edu.org',
    password: 'password123',
    role: 'faculty',
    title: 'Professor of Biblical Hermeneutics & Dean of Biblical Studies',
    country: 'United States',
    facultyId: 'BIBU-FAC-104',
    schoolId: 'sch-biblical',
    bio: 'Over 25 years teaching Old Testament, Biblical Hebrew, and Exegetical Methodologies. Author of "Hermeneutics for the 21st Century Pulpit".',
    status: 'active',
  },
  {
    id: 'usr-registrar-1',
    name: 'Rev. Dr. Sarah M. Jenkins, Th.D.',
    email: 'registrar@bibu-edu.org',
    password: 'password123',
    role: 'registrar',
    title: 'University Registrar & Director of Academic Records',
    country: 'United States',
    facultyId: 'BIBU-ADM-008',
    bio: 'Overseeing global student records, RPL credit transfers, credential verification, and graduation cohorts.',
    status: 'active',
  },
  {
    id: 'usr-admin-1',
    name: 'Dr. Michael C. Sterling, Th.D., D.Min.',
    email: 'chancellor@bibu-edu.org',
    password: 'password123',
    role: 'admin',
    title: 'President & Chancellor',
    country: 'United States',
    bio: 'Founder and Chancellor of Breakthrough International Bible University. Evangelist and Theological Educator with global apostolic ministry.',
    status: 'active',
  },
  {
    id: 'usr-alumni-1',
    name: 'Rev. Joshua K. Osei',
    email: 'joshua.osei@alumni.bibu-edu.org',
    password: 'password123',
    role: 'alumni',
    title: 'Presiding Bishop, Breakthrough Missions Network',
    country: 'Ghana',
    studentId: 'BIBU-2021-AL-3109',
    programName: 'Doctor of Ministry (D.Min)',
    bio: 'Graduated in 2023 with High Honors. Currently overseeing 42 church plants across West Africa.',
    status: 'active',
  },
  {
    id: 'usr-national-rep-1',
    name: 'Rt. Rev. Dr. Patrick M. Njuguna',
    email: 'kenya.national@bibu.university',
    password: 'password123',
    role: 'national_rep',
    title: 'Kenya National Representative & Senior Overseer',
    country: 'Kenya',
    facultyId: 'BIBU-NAT-KE-001',
    bio: 'Authorized National Representative overseeing 47 Kenyan Counties and 98 Examination Centres.',
    status: 'active',
  },
  {
    id: 'usr-centre-rep-1',
    name: 'Rev. Stephen Kamau Ndirangu',
    email: 'nairobi.eastlands@bibu.university',
    password: 'password123',
    role: 'centre_rep',
    title: 'Examination Centre Administrator (BIBU-KE-002-NAI)',
    country: 'Kenya',
    facultyId: 'BIBU-CTR-KE-002',
    bio: 'Centre Administrator for Nairobi Eastlands Examination Centre managing candidate registrations and attendance.',
    status: 'active',
  },
  {
    id: 'usr-examiner-1',
    name: 'Dr. Thomas Sterling, Ph.D.',
    email: 'examinations@bibu.university',
    password: 'password123',
    role: 'examiner',
    title: 'Global Director of Examinations & Proctoring',
    country: 'United States',
    facultyId: 'BIBU-EXM-001',
    bio: 'Directing worldwide examination scheduling, attendance registers, seating clearance and candidate verification.',
    status: 'active',
  }
];

export const INITIAL_SCHOOLS: School[] = [
  {
    id: 'sch-biblical',
    name: 'School of Biblical Studies',
    code: 'SBS',
    deanName: 'Dr. Thomas E. Wright, Ph.D.',
    deanTitle: 'Dean of Biblical Studies',
    description: 'Providing rigorous immersion in Old & New Testament exegesis, original languages, and dispensational & biblical hermeneutics.',
    iconName: 'BookOpen',
    departments: ['Old Testament Studies', 'New Testament Studies', 'Biblical Languages & Hermeneutics'],
    programsCount: 5,
  },
  {
    id: 'sch-theology',
    name: 'School of Theological Studies',
    code: 'STS',
    deanName: 'Dr. Jonathan Vance, Th.D.',
    deanTitle: 'Dean of Systematic Theology',
    description: 'Deep exploration of Systematic Theology, Historical Dogmatics, Christology, Pneumatology, and Contemporary Christian Ethics.',
    iconName: 'Cross',
    departments: ['Systematic Theology', 'Historical Theology', 'Christian Apologetics & Philosophy'],
    programsCount: 5,
  },
  {
    id: 'sch-ministry',
    name: 'School of Christian Ministry',
    code: 'SCM',
    deanName: 'Dr. Deborah K. Alverez, D.Min.',
    deanTitle: 'Dean of Practical Ministry',
    description: 'Empowering church planters, worship leaders, youth directors, and Christian workers with practical ministry toolsets.',
    iconName: 'Flame',
    departments: ['Church Planting & Growth', 'Worship Arts & Liturgy', 'Youth & Family Ministry'],
    programsCount: 5,
  },
  {
    id: 'sch-leadership',
    name: 'School of Christian Leadership',
    code: 'SCL',
    deanName: 'Dr. Marcus Vance, Ph.D.',
    deanTitle: 'Dean of Leadership & Governance',
    description: 'Equipping senior pastors, ministry executives, and non-profit leaders with biblical governance, strategic vision, and ethics.',
    iconName: 'Award',
    departments: ['Strategic Church Leadership', 'Non-Profit Governance', 'Financial Stewardship & Ethics'],
    programsCount: 5,
  },
  {
    id: 'sch-missions',
    name: 'School of Missions and Evangelism',
    code: 'SME',
    deanName: 'Dr. Samuel Boateng, D.Miss.',
    deanTitle: 'Dean of World Missions',
    description: 'Training field evangelists, frontier missionaries, and cross-cultural church planters for worldwide harvest and gospel proclamation.',
    iconName: 'Globe',
    departments: ['Missiology', 'Cross-Cultural Evangelism', 'Frontier Church Planting', 'World Religions'],
    programsCount: 5,
  },
  {
    id: 'sch-pastoral',
    name: 'School of Pastoral Studies',
    code: 'SPS',
    deanName: 'Rev. Dr. Robert Lindqvist, D.Min.',
    deanTitle: 'Dean of Pastoral Theology',
    description: 'Fostering pastoral excellence in homiletics, pastoral care, ecclesiastical administration, and shepherd leadership.',
    iconName: 'HeartHandshake',
    departments: ['Homiletics & Preaching', 'Pastoral Care & Visitation', 'Ecclesiastical Law & Administration'],
    programsCount: 5,
  },
  {
    id: 'sch-counseling',
    name: 'School of Christian Counseling',
    code: 'SCC',
    deanName: 'Dr. Elizabeth R. Montgomery, Ph.D.',
    deanTitle: 'Dean of Christian Counseling',
    description: 'Integrating biblical authority with sound pastoral counseling psychology to heal broken hearts, marriages, and crisis situations.',
    iconName: 'ShieldCheck',
    departments: ['Biblical Counseling', 'Marriage & Family Restoration', 'Grief & Trauma Ministry'],
    programsCount: 4,
  },
  {
    id: 'sch-chaplaincy',
    name: 'School of Chaplaincy',
    code: 'SCH',
    deanName: 'Chaplain (Col.) Arthur Sterling, D.Min.',
    deanTitle: 'Dean of Chaplaincy Ministries',
    description: 'Preparing certified chaplains for institutional ministry in hospitals, military units, prisons, airports, and corporate environments.',
    iconName: 'Landmark',
    departments: ['Healthcare Chaplaincy', 'Correctional & Prison Ministry', 'Military & First Responder Chaplaincy'],
    programsCount: 4,
  },
  {
    id: 'sch-education',
    name: 'School of Christian Education',
    code: 'SCE',
    deanName: 'Dr. Carolyn Perez, Ed.D.',
    deanTitle: 'Dean of Christian Education',
    description: 'Training Sunday School directors, Christian school educators, curriculum creators, and bible college instructors.',
    iconName: 'GraduationCap',
    departments: ['Christian Pedagogy', 'Sunday School & Discipleship', 'Bible College Teaching Methods'],
    programsCount: 4,
  },
];

export const INITIAL_PROGRAMS: Program[] = [
  // Biblical Studies
  {
    id: 'prog-cbs',
    schoolId: 'sch-biblical',
    name: 'Certificate in Biblical Studies',
    code: 'CBS-01',
    level: 'Certificate',
    durationMonths: 6,
    totalCredits: 18,
    description: 'Foundational study of the scriptures designed for Sunday school teachers and local church workers.',
    learningOutcomes: ['Demonstrate broad knowledge of OT and NT structure', 'Apply basic principles of scripture interpretation'],
    careerPaths: ['Bible Study Leader', 'Sunday School Teacher', 'Church Worker'],
    tuitionFeeUSD: 450,
  },
  {
    id: 'prog-dbs',
    schoolId: 'sch-biblical',
    name: 'Diploma in Biblical Studies',
    code: 'DBS-02',
    level: 'Diploma',
    durationMonths: 12,
    totalCredits: 36,
    description: 'Intermediate immersion into the books of the Bible, historical background, and hermeneutical principles.',
    learningOutcomes: ['Analyze prophetic and poetic biblical literature', 'Formulate contextual application for ministry'],
    careerPaths: ['Associate Minister', 'Youth Pastor', 'Ministry Evangelist'],
    tuitionFeeUSD: 900,
  },
  {
    id: 'prog-bbs',
    schoolId: 'sch-biblical',
    name: 'Bachelor of Biblical Studies (B.B.S)',
    code: 'BBS-03',
    level: 'Bachelor',
    durationMonths: 36,
    totalCredits: 120,
    description: 'Comprehensive undergraduate degree in biblical exegesis, historical context, and introductory Greek and Hebrew.',
    learningOutcomes: ['Conduct syntactical and exegetical study of biblical passages', 'Develop systematic biblical presentations'],
    careerPaths: ['Bible Teacher', 'Assistant Pastor', 'Christian School Teacher'],
    tuitionFeeUSD: 2400,
    featured: true,
  },
  {
    id: 'prog-mbs',
    schoolId: 'sch-biblical',
    name: 'Master of Biblical Studies (M.B.S)',
    code: 'MBS-04',
    level: 'Master',
    durationMonths: 24,
    totalCredits: 48,
    description: 'Advanced graduate examination of theological nuances, ancient Near Eastern backgrounds, and original language exegesis.',
    learningOutcomes: ['Synthesize advanced theological arguments', 'Produce scholarly research papers on biblical themes'],
    careerPaths: ['Seminary Lecturer', 'Senior Minister', 'Theological Author'],
    tuitionFeeUSD: 3200,
  },
  {
    id: 'prog-dbs-doc',
    schoolId: 'sch-biblical',
    name: 'Doctor of Biblical Studies (D.B.S)',
    code: 'DBS-05',
    level: 'Doctorate',
    durationMonths: 36,
    totalCredits: 60,
    description: 'Terminal research doctorate focusing on advanced hermeneutics, manuscript evidence, and scholarly publication.',
    learningOutcomes: ['Defend an original dissertation advancing biblical scholarship', 'Demonstrate mastery in ancient biblical contexts'],
    careerPaths: ['Professor of Biblical Studies', 'Theological Dean', 'Academic Researcher'],
    tuitionFeeUSD: 4500,
  },

  // Theological Studies
  {
    id: 'prog-bth',
    schoolId: 'sch-theology',
    name: 'Bachelor of Theology (B.Th)',
    code: 'BTH-10',
    level: 'Bachelor',
    durationMonths: 36,
    totalCredits: 120,
    description: 'Rigorous foundational degree exploring Systematic Theology, Doctrine of God, Soteriology, Eschatology, and Apologetics.',
    learningOutcomes: ['Articulate orthodox Christian doctrine with clarity and biblically sound proof', 'Defend the faith against historical and modern heresies'],
    careerPaths: ['Pastor', 'Apologist', 'Church Planter', 'Seminary Instructor'],
    tuitionFeeUSD: 2400,
    featured: true,
  },
  {
    id: 'prog-mts',
    schoolId: 'sch-theology',
    name: 'Master of Theological Studies (M.T.S)',
    code: 'MTS-11',
    level: 'Master',
    durationMonths: 24,
    totalCredits: 48,
    description: 'Graduate program providing deep inquiry into historical dogma, contemporary theological debates, and pastoral dogmatics.',
    learningOutcomes: ['Evaluate theological paradigms from patristic to modern eras', 'Formulate constructive responses to ethical challenges'],
    careerPaths: ['Theology Professor', 'Think-Tank Scholar', 'Ordained Minister'],
    tuitionFeeUSD: 3200,
    featured: true,
  },
  {
    id: 'prog-thd',
    schoolId: 'sch-theology',
    name: 'Doctor of Theology (Th.D)',
    code: 'THD-12',
    level: 'Doctorate',
    durationMonths: 36,
    totalCredits: 60,
    description: 'Premier terminal degree emphasizing systematic doctrine, historical research, and a comprehensive doctoral dissertation.',
    learningOutcomes: ['Complete peer-reviewed dissertation defense', 'Provide institutional theological leadership worldwide'],
    careerPaths: ['Seminary President', 'Senior Theologian', 'University Chancellor'],
    tuitionFeeUSD: 4800,
  },

  // Christian Ministry
  {
    id: 'prog-bcm',
    schoolId: 'sch-ministry',
    name: 'Bachelor of Christian Ministry (B.C.M)',
    code: 'BCM-20',
    level: 'Bachelor',
    durationMonths: 36,
    totalCredits: 120,
    description: 'Practical training for front-line ministry workers in preaching, church growth, administration, and discipleship.',
    learningOutcomes: ['Design sustainable discipleship systems', 'Lead ministry teams and worship gatherings with excellence'],
    careerPaths: ['Pastoral Leader', 'Church Administrator', 'Evangelistic Outreach Director'],
    tuitionFeeUSD: 2400,
  },
  {
    id: 'prog-mcm',
    schoolId: 'sch-ministry',
    name: 'Master of Christian Ministry (M.C.M)',
    code: 'MCM-21',
    level: 'Master',
    durationMonths: 24,
    totalCredits: 48,
    description: 'Strategic leadership and administrative mastery for experienced ministers seeking greater Kingdom impact.',
    learningOutcomes: ['Develop scalable church ministry models', 'Implement cross-generational mentoring frameworks'],
    careerPaths: ['Senior Pastor', 'Regional Overseer', 'Ministry Director'],
    tuitionFeeUSD: 3200,
    featured: true,
  },
  {
    id: 'prog-dmin',
    schoolId: 'sch-ministry',
    name: 'Doctor of Ministry (D.Min)',
    code: 'DMIN-22',
    level: 'Doctorate',
    durationMonths: 36,
    totalCredits: 60,
    description: 'Professional doctorate tailored for seasoned pastors and ministry pioneers, requiring an applied ministry research project.',
    learningOutcomes: ['Execute a major transformation project in active ministry', 'Demonstrate high-level spiritual and administrative leadership'],
    careerPaths: ['Presiding Bishop', 'Apostolic Leader', 'Global Ministry Strategist'],
    tuitionFeeUSD: 4600,
    featured: true,
  },

  // Christian Leadership
  {
    id: 'prog-mcl',
    schoolId: 'sch-leadership',
    name: 'Master of Christian Leadership (M.C.L)',
    code: 'MCL-31',
    level: 'Master',
    durationMonths: 24,
    totalCredits: 48,
    description: 'Strategic governance, team building, conflict resolution, and financial integrity for executive Christian leaders.',
    learningOutcomes: ['Implement ethical governance policies', 'Navigate organizational change and crisis with spiritual authority'],
    careerPaths: ['Executive Pastor', 'NGO Director', 'Christian College Administrator'],
    tuitionFeeUSD: 3200,
  },

  // Missions & Evangelism
  {
    id: 'prog-bme',
    schoolId: 'sch-missions',
    name: 'Bachelor of Missions and Evangelism',
    code: 'BME-40',
    level: 'Bachelor',
    durationMonths: 36,
    totalCredits: 120,
    description: 'Intensive preparation for apostolic pioneer church planting and cross-cultural missiological engagement.',
    learningOutcomes: ['Adapt the gospel effectively in varied cultural milieus', 'Establish self-sustaining indigenous local churches'],
    careerPaths: ['Foreign Missionary', 'Urban Evangelist', 'Church Planter'],
    tuitionFeeUSD: 2400,
  },

  // Christian Counseling
  {
    id: 'prog-mcc',
    schoolId: 'sch-counseling',
    name: 'Master of Christian Counseling (M.C.C)',
    code: 'MCC-51',
    level: 'Master',
    durationMonths: 24,
    totalCredits: 48,
    description: 'Therapeutic and spiritual counseling integration for pastoral trauma care, marriage restoration, and family healing.',
    learningOutcomes: ['Apply biblical counseling protocols with clinical ethical discernment', 'Facilitate crisis debriefing and grief counseling'],
    careerPaths: ['Pastoral Counselor', 'Family Ministry Director', 'Crisis Chaplain'],
    tuitionFeeUSD: 3200,
    featured: true,
  },

  // Chaplaincy
  {
    id: 'prog-bch',
    schoolId: 'sch-chaplaincy',
    name: 'Bachelor of Chaplaincy Ministries',
    code: 'BCH-60',
    level: 'Bachelor',
    durationMonths: 36,
    totalCredits: 120,
    description: 'Endorsement-ready preparation for institutional chaplaincy in hospitals, correctional facilities, and emergency services.',
    learningOutcomes: ['Provide empathetic presence in trauma environments', 'Navigate inter-faith institutional protocols with Christian integrity'],
    careerPaths: ['Hospital Chaplain', 'Prison Chaplain', 'First Responder Chaplain'],
    tuitionFeeUSD: 2400,
  },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'crs-herm-301',
    code: 'BIB-301',
    title: 'Biblical Hermeneutics & Exegetical Method',
    schoolId: 'sch-biblical',
    programIds: ['prog-bbs', 'prog-bth', 'prog-mbs', 'prog-mts'],
    creditHours: 3,
    level: 'Bachelor',
    semester: 'Fall 2026',
    instructorId: 'usr-faculty-1',
    instructorName: 'Dr. Thomas E. Wright, Ph.D.',
    description: 'A comprehensive study of the principles of sound biblical interpretation, grammatical-historical exegesis, genre analysis, and modern contextual application.',
    learningOutcomes: [
      'Master the grammatical-historical hermeneutical method',
      'Distinguish between prescriptive and descriptive biblical literature',
      'Conduct original word studies using Greek and Hebrew lexicons',
      'Bridge the ancient cultural horizon to the contemporary pulpit'
    ],
    prerequisites: ['Introduction to the Bible', 'New Testament Survey'],
    modulesCount: 4,
    biblePassages: ['2 Timothy 2:15', '2 Peter 1:20-21', 'Nehemiah 8:8', 'Luke 24:27'],
    enrolledStudentsCount: 42,
  },
  {
    id: 'crs-theo-201',
    code: 'THE-201',
    title: 'Systematic Theology I: Doctrine of God & Scripture',
    schoolId: 'sch-theology',
    programIds: ['prog-bth', 'prog-bbs', 'prog-mts'],
    creditHours: 3,
    level: 'Bachelor',
    semester: 'Fall 2026',
    instructorId: 'usr-faculty-1',
    instructorName: 'Dr. Jonathan Vance, Th.D.',
    description: 'Exploration of Bibliology, Theology Proper (the nature, attributes, and Trinitarian life of God), and Divine Providence across historical covenants.',
    learningOutcomes: [
      'Articulate the classical orthodox doctrine of the Holy Trinity',
      'Defend the verbal, plenary inspiration and inerrancy of Scripture',
      'Analyze the divine attributes and sovereignty versus human will'
    ],
    prerequisites: ['Introduction to Theology'],
    modulesCount: 4,
    biblePassages: ['Deuteronomy 6:4', 'Psalm 19:1-7', 'John 1:1-18', '2 Timothy 3:16'],
    enrolledStudentsCount: 56,
  },
  {
    id: 'crs-past-401',
    code: 'PAS-401',
    title: 'Pastoral Ministry & Expository Homiletics',
    schoolId: 'sch-pastoral',
    programIds: ['prog-bth', 'prog-bcm', 'prog-mcm'],
    creditHours: 3,
    level: 'Bachelor',
    semester: 'Fall 2026',
    instructorId: 'usr-faculty-1',
    instructorName: 'Rev. Dr. Robert Lindqvist, D.Min.',
    description: 'Principles and practices of sermon preparation, delivery, pastoral shepherding, church administration, and ethics in the pastoral office.',
    learningOutcomes: [
      'Construct a 4-part expository sermon outline from raw biblical text',
      'Execute pastoral ordinances: Baptism, Communion, Weddings, Funerals',
      'Formulate pastoral ethics in confidentiality and financial handling'
    ],
    prerequisites: ['Biblical Hermeneutics'],
    modulesCount: 4,
    biblePassages: ['1 Timothy 3:1-7', 'Titus 1:5-9', '1 Peter 5:1-4', '2 Timothy 4:1-5'],
    enrolledStudentsCount: 38,
  },
  {
    id: 'crs-miss-302',
    code: 'MIS-302',
    title: 'Cross-Cultural Missions & Church Planting',
    schoolId: 'sch-missions',
    programIds: ['prog-bme', 'prog-bcm', 'prog-mcm'],
    creditHours: 3,
    level: 'Bachelor',
    semester: 'Fall 2026',
    instructorId: 'usr-faculty-1',
    instructorName: 'Dr. Samuel Boateng, D.Miss.',
    description: 'Biblical basis of world missions, contextualization, dynamic indigenous church reproduction models, and overcoming cross-cultural barriers.',
    learningOutcomes: [
      'Formulate a 3-year strategic church planting blueprint',
      'Identify cross-cultural communication pitfalls and animistic worldviews',
      'Mobilize local church resources for global unreached people groups'
    ],
    prerequisites: ['Introduction to Missions'],
    modulesCount: 3,
    biblePassages: ['Matthew 28:18-20', 'Acts 1:8', 'Romans 15:20-21', 'Revelation 7:9'],
    enrolledStudentsCount: 29,
  },
  {
    id: 'crs-coun-305',
    code: 'COU-305',
    title: 'Pastoral Counseling, Grief & Crisis Intervention',
    schoolId: 'sch-counseling',
    programIds: ['prog-mcc', 'prog-bth', 'prog-bch'],
    creditHours: 3,
    level: 'Master',
    semester: 'Fall 2026',
    instructorId: 'usr-faculty-1',
    instructorName: 'Dr. Elizabeth R. Montgomery, Ph.D.',
    description: 'Equipping counselors and ministers with theological and therapeutic frameworks to address bereavement, trauma, marital discord, and acute anxiety.',
    learningOutcomes: [
      'Apply the 5 stages of pastoral grief intervention with prayerful empathy',
      'Demonstrate active listening and diagnostic boundary discernment',
      'Integrate Scripture, prayer, and professional referral protocols'
    ],
    prerequisites: ['Foundations of Christian Counseling'],
    modulesCount: 4,
    biblePassages: ['2 Corinthians 1:3-7', 'Psalm 34:18', 'Galatians 6:2', 'James 5:14-16'],
    enrolledStudentsCount: 31,
  },
];

export const INITIAL_MODULES: Module[] = [
  {
    id: 'mod-herm-1',
    courseId: 'crs-herm-301',
    order: 1,
    title: 'Module 1: Foundations of Biblical Hermeneutics',
    description: 'Understanding the necessity of sound interpretation, the role of the Holy Spirit, and the illumination of scripture.',
    lessons: [
      {
        id: 'les-herm-101',
        moduleId: 'mod-herm-1',
        courseId: 'crs-herm-301',
        order: 1,
        title: 'Lesson 1.1: The Divine Author & Human Instrumentation',
        introduction: 'Hermeneutics is the science and art of biblical interpretation. Without sound principles, the preacher risks imposing human presuppositions upon the holy text (eisegesis) rather than drawing out the genuine divine revelation (exegesis).',
        scriptureReferences: ['2 Timothy 2:15', '2 Peter 1:20-21', 'Hebrews 1:1-2'],
        notes: `### I. The Necessity of Hermeneutics
The Bible is simultaneously the timeless, verbally inspired Word of God and historically situated in ancient human language, culture, geography, and historical events.

1. **The Historical Gap:** Between 2,000 to 3,500 years separate the modern reader from the original authors.
2. **The Linguistic Gap:** The Old Testament was authored predominantly in Classical Hebrew (with Aramaic portions in Daniel & Ezra); the New Testament in Koine Greek.
3. **The Cultural Gap:** Ancient Near Eastern covenant formulas, Hellenistic Roman civic customs, and Jewish Second Temple idioms require careful contextual bridging.

### II. Exegesis vs. Eisegesis
- **Exegesis** (*Greek: exēgeomai*, to lead out): Reading out of the text what the Holy Spirit and original author placed within it.
- **Eisegesis** (*Greek: eis*, into): Reading foreign theological, cultural, or personal biases into the text.

### III. The Illumination of the Holy Spirit
While cognitive study is essential, 1 Corinthians 2:14 declares that spiritual truth is spiritually discerned. The interpreter must approach Scripture in prayer, humility, and submission to the Spirit's guidance.`,
        keyConcepts: [
          'Exegesis (Drawing out original meaning)',
          'Eisegesis (Subjective imposing of bias)',
          'Verbal Plenary Inspiration',
          'Sensus Literalis (The literal, contextual sense)'
        ],
        ministryApplication: 'When preparing your weekly sermon, dedicate the first 3 hours entirely to exegetical study before consulting modern commentaries or illustrations. Ensure your main points reflect the exact intent of the biblical author.',
        reflectionQuestions: [
          'How does personal cultural bias influence the way you read familiar gospel narratives?',
          'What is the danger of preaching a theological principle that cannot be anchored in the grammatical-historical context of the passage?'
        ],
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        audioUrl: 'https://example.com/audio/herm-101.mp3',
        audioDuration: '38 mins',
        downloadableMaterials: [
          { title: 'Lecture Notes: Introduction to Hermeneutics (PDF)', type: 'PDF', size: '1.4 MB' },
          { title: 'Greek & Hebrew Exegetical Worksheet (DOC)', type: 'DOC', size: '320 KB' }
        ],
        quizId: 'qz-herm-1'
      },
      {
        id: 'les-herm-102',
        moduleId: 'mod-herm-1',
        courseId: 'crs-herm-301',
        order: 2,
        title: 'Lesson 1.2: Historical & Cultural Contextualization',
        introduction: 'Every biblical book was written to a specific historical audience facing distinct political, religious, and economic circumstances. Uncovering this background unlocks the true heartbeat of the passage.',
        scriptureReferences: ['Nehemiah 8:8', 'Acts 17:16-34', 'Colossians 2:8-15'],
        notes: `### Historical Background Analysis
To properly exegete a text, the scholar must investigate:
1. **Author:** Who wrote it? What was his spiritual and vocational background?
2. **Audience:** To whom was it addressed? What spiritual crises or persecutions were they enduring?
3. **Date & Location:** Where was the author and where were the recipients?
4. **Occasion & Purpose:** What compelled the writing of this epistle or prophecy?

For instance, understanding the Colossian heresy (proto-Gnostic syncretism) clarifies Paul's magnificent exaltation of Christ's cosmic preeminence in Colossians 1:15-20.`,
        keyConcepts: ['Historical-Grammatical Method', 'Occasion of Writing', 'Original Recipient Context'],
        ministryApplication: 'Before teaching any epistle, present a 5-minute historical overview of the city (e.g. Ephesus or Corinth) to help your congregation grasp why the Apostle framed his instructions as he did.',
        reflectionQuestions: [
          'How does knowing Corinth was a hyper-commercialized port city illuminate Paul’s warnings on purity in 1 Corinthians 6?'
        ],
        downloadableMaterials: [
          { title: 'New Testament Greco-Roman Background Guide (PDF)', type: 'PDF', size: '2.8 MB' }
        ]
      }
    ]
  },
  {
    id: 'mod-herm-2',
    courseId: 'crs-herm-301',
    order: 2,
    title: 'Module 2: Literary Genres in Sacred Scripture',
    description: 'Mastering the hermeneutics of Narrative, Law, Poetry, Wisdom, Prophecy, Gospels, Epistles, and Apocalyptic.',
    lessons: [
      {
        id: 'les-herm-201',
        moduleId: 'mod-herm-2',
        courseId: 'crs-herm-301',
        order: 1,
        title: 'Lesson 2.1: Interpreting Biblical Narrative & Old Testament Law',
        introduction: 'Narratives constitute over 40% of the Old Testament. Understanding how God reveals His covenant faithfulness through historical chronicles without validating all human actions is fundamental.',
        scriptureReferences: ['Genesis 12:1-3', 'Exodus 20:1-17', '1 Corinthians 10:1-11'],
        notes: `### Rules for Old Testament Narrative
1. Narrative records *what happened*, not necessarily *what should have happened*. (Descriptive vs. Prescriptive).
2. God is the ultimate protagonist of every biblical narrative.
3. Observe repetition, dialogue, divine commentary, and structural climaxes.`,
        keyConcepts: ['Descriptive vs. Prescriptive', 'Theocentric Narrative', 'Covenant Continuity'],
        ministryApplication: 'Do not moralize Old Testament character flaws as divine commands. Always point the listener to God’s redemptive mercy fulfilled in Jesus Christ.',
        reflectionQuestions: [
          'Identify a passage in Judges that is descriptive rather than prescriptive for Christian ethics.'
        ],
        downloadableMaterials: [
          { title: 'Genre Interpretation Matrix (PDF)', type: 'PDF', size: '1.9 MB' }
        ]
      }
    ]
  },
  {
    id: 'mod-herm-3',
    courseId: 'crs-herm-301',
    order: 3,
    title: 'Module 3: Greek & Hebrew Exegetical Word Studies',
    description: 'Avoiding semantic fallacies, root fallacy corrections, and working with Strong numbers and BDAG lexicon.',
    lessons: [
      {
        id: 'les-herm-301',
        moduleId: 'mod-herm-3',
        courseId: 'crs-herm-301',
        order: 1,
        title: 'Lesson 3.1: Identifying and Preventing Semantic Fallacies',
        introduction: 'Etymological fallacies, root fallacies, and illegitimate totality transfer often distort preaching. Learn how words derive meaning from usage within literary context.',
        scriptureReferences: ['John 21:15-17', '1 Corinthians 13:1-3'],
        notes: 'Word studies must be anchored in contemporaneous usage rather than modern English cognates or false etymology.',
        keyConcepts: ['Semantic Range', 'Illegitimate Totality Transfer', 'Contextual Determination'],
        ministryApplication: 'Verify Hebrew and Greek semantic fields using reputable lexicons before building a sermon theme upon an etymological root.',
        reflectionQuestions: ['How does context determine whether "agape" and "phileo" represent distinct or synonymous concepts in John 21?'],
        downloadableMaterials: [{ title: 'Biblical Exegetical Lexicon Guide (PDF)', type: 'PDF', size: '2.1 MB' }]
      }
    ]
  },
  {
    id: 'mod-herm-4',
    courseId: 'crs-herm-301',
    order: 4,
    title: 'Module 4: Practical Homiletical Application & Hermeneutics',
    description: 'Bridging the ancient biblical horizon to contemporary sermons, pastoral counseling, and Christian ethics.',
    lessons: [
      {
        id: 'les-herm-401',
        moduleId: 'mod-herm-4',
        courseId: 'crs-herm-301',
        order: 1,
        title: 'Lesson 4.1: The Hermeneutical Bridge: Text to Sermon',
        introduction: 'Transforming exegetical discoveries into clear, gospel-centered, and actionable preaching points without compromising the original meaning.',
        scriptureReferences: ['2 Timothy 4:1-5', 'Titus 2:1-15'],
        notes: 'The preacher acts as a bridge builder between the ancient text and the modern pew.',
        keyConcepts: ['Theological Principlizing', 'Contemporary Contextualization', 'Christocentric Hermeneutic'],
        ministryApplication: 'Ensure every application in your sermon flows directly from the theological principle deduced from the exegesis.',
        reflectionQuestions: ['What safeguards ensure cultural relevance does not compromise doctrinal fidelity?'],
        downloadableMaterials: [{ title: 'Sermon Exegetical Worksheet (PDF)', type: 'PDF', size: '1.2 MB' }]
      }
    ]
  },

  // Systematic Theology I (crs-theo-201)
  {
    id: 'mod-theo-1',
    courseId: 'crs-theo-201',
    order: 1,
    title: 'Module 1: Prolegomena & Doctrine of Divine Revelation (Bibliology)',
    description: 'General revelation, special revelation, verbal plenary inspiration, canonization, and the historical inerrancy of Scripture.',
    lessons: [
      {
        id: 'les-theo-101',
        moduleId: 'mod-theo-1',
        courseId: 'crs-theo-201',
        order: 1,
        title: 'Lesson 1.1: General and Special Revelation',
        introduction: 'God has revealed Himself through the cosmos, human conscience, historical acts, the Incarnate Word, and Sacred Scripture.',
        scriptureReferences: ['Psalm 19:1-6', 'Romans 1:18-20', 'Hebrews 1:1-4'],
        notes: 'General revelation leaves humanity without excuse; special revelation conveys redemptive knowledge through Jesus Christ.',
        keyConcepts: ['General Revelation', 'Special Revelation', 'Inscripturation'],
        ministryApplication: 'Use the beauty of creation as an apologetic bridge when engaging skeptical seekers.',
        reflectionQuestions: ['Why is general revelation insufficient for saving faith apart from the Gospel?'],
        downloadableMaterials: [{ title: 'Doctrine of Scripture Compendium (PDF)', type: 'PDF', size: '2.5 MB' }]
      }
    ]
  },
  {
    id: 'mod-theo-2',
    courseId: 'crs-theo-201',
    order: 2,
    title: 'Module 2: Theology Proper & The Triune Godhead',
    description: 'The incommunicable and communicable attributes of God, Trinitarian ontology, and historical dogmatic formulations.',
    lessons: [
      {
        id: 'les-theo-201',
        moduleId: 'mod-theo-2',
        courseId: 'crs-theo-201',
        order: 1,
        title: 'Lesson 2.1: The Classical Orthodox Trinity',
        introduction: 'God is one in essence (ousia) existing eternally in three co-equal, co-eternal Persons (hypostaseis): Father, Son, and Holy Spirit.',
        scriptureReferences: ['Deuteronomy 6:4', 'Matthew 28:19', '2 Corinthians 13:14'],
        notes: 'Refuting modalism, Arianism, tritheism, and subordinationism using Nicene-Constantinopolitan theological rigor.',
        keyConcepts: ['Perichoresis', 'Homoousios', 'Trinitarian Relations of Origin'],
        ministryApplication: 'Preach Trinitarian doxology to cultivate awe and worship in the congregational liturgy.',
        reflectionQuestions: ['How does the Trinity provide the ultimate archetype for Christian community and mutual self-giving love?'],
        downloadableMaterials: [{ title: 'Trinitarian Theological Matrix (PDF)', type: 'PDF', size: '1.8 MB' }]
      }
    ]
  },
  {
    id: 'mod-theo-3',
    courseId: 'crs-theo-201',
    order: 3,
    title: 'Module 3: Divine Sovereignty, Creation & Providence',
    description: 'Creatio ex nihilo, preservation, divine government, and addressing the problem of evil (Theodicy).',
    lessons: [
      {
        id: 'les-theo-301',
        moduleId: 'mod-theo-3',
        courseId: 'crs-theo-201',
        order: 1,
        title: 'Lesson 3.1: Divine Providence & Theodicy',
        introduction: 'Understanding how God sovereignly governs all creatures, actions, and historical circumstances for His ultimate glory.',
        scriptureReferences: ['Genesis 50:20', 'Romans 8:28-30', 'Ephesians 1:11'],
        notes: 'God is never the author of sin, yet in His infinite wisdom He orchestrates all events according to His good purpose.',
        keyConcepts: ['Creatio Ex Nihilo', 'Primary & Secondary Causality', 'Theodicy'],
        ministryApplication: 'Offer deep pastoral comfort to suffering believers rooted in the unshakeable sovereignty of God.',
        reflectionQuestions: ['How does Joseph’s confession in Genesis 50:20 resolve tension between human intent and divine purpose?'],
        downloadableMaterials: [{ title: 'Providence and Theodicy Notes (PDF)', type: 'PDF', size: '1.6 MB' }]
      }
    ]
  },

  // Pastoral Ministry & Homiletics (crs-past-401)
  {
    id: 'mod-past-1',
    courseId: 'crs-past-401',
    order: 1,
    title: 'Module 1: The Pastoral Office: Calling, Character & Shepherding',
    description: 'Biblical qualifications for elders and overseers, spiritual disciplines, family balance, and soul maintenance for the minister.',
    lessons: [
      {
        id: 'les-past-101',
        moduleId: 'mod-past-1',
        courseId: 'crs-past-401',
        order: 1,
        title: 'Lesson 1.1: Biblical Qualifications of the Overseer',
        introduction: '1 Timothy 3 and Titus 1 set the non-negotiable spiritual, moral, marital, and administrative benchmarks for pastoral leadership.',
        scriptureReferences: ['1 Timothy 3:1-7', 'Titus 1:5-9', '1 Peter 5:1-4'],
        notes: 'Character precedes competence. A pastor disqualified in integrity damages the witness of the Gospel.',
        keyConcepts: ['Blameless Character', 'Pastoral Stewardship', 'Shepherd Mindset'],
        ministryApplication: 'Establish personal accountability structures for prayer, financial integrity, and emotional rest.',
        reflectionQuestions: ['Why is home governance (1 Tim 3:4-5) a prerequisite for ecclesiastical leadership?'],
        downloadableMaterials: [{ title: 'Pastoral Calling & Ethics Manual (PDF)', type: 'PDF', size: '2.0 MB' }]
      }
    ]
  },
  {
    id: 'mod-past-2',
    courseId: 'crs-past-401',
    order: 2,
    title: 'Module 2: Expository Preaching & Homiletical Architecture',
    description: 'Crafting the Big Idea, sermon introductions, transitions, exegetical outlines, and passionate delivery.',
    lessons: [
      {
        id: 'les-past-201',
        moduleId: 'mod-past-2',
        courseId: 'crs-past-401',
        order: 1,
        title: 'Lesson 2.1: The Expository Homiletic Process',
        introduction: 'Moving from the text to the theological idea and finally the homiletical proposition that pierces the heart.',
        scriptureReferences: ['Nehemiah 8:8', '2 Timothy 4:1-2'],
        notes: 'The central idea of the sermon must directly mirror the central idea of the Scripture passage.',
        keyConcepts: ['The Big Idea', 'Homiletic Proposition', 'Illustrative Clarity'],
        ministryApplication: 'Write out your single proposition sentence before constructing sermon sub-points.',
        reflectionQuestions: ['How can a preacher avoid turning an expository sermon into a dry academic lecture?'],
        downloadableMaterials: [{ title: 'Homiletics Outline Template (DOC)', type: 'DOC', size: '450 KB' }]
      }
    ]
  },
  {
    id: 'mod-past-3',
    courseId: 'crs-past-401',
    order: 3,
    title: 'Module 3: Liturgical Sacraments, Weddings & Funerals',
    description: 'Administering water baptism, the Lord’s Supper, officiating Christian matrimony, and conducting Christian burial services.',
    lessons: [
      {
        id: 'les-past-301',
        moduleId: 'mod-past-3',
        courseId: 'crs-past-401',
        order: 1,
        title: 'Lesson 3.1: Administering Baptism & Holy Communion',
        introduction: 'The biblical theology, ecclesiastical protocols, and liturgical conduct for Christian ordinances.',
        scriptureReferences: ['Matthew 28:19', '1 Corinthians 11:23-32'],
        notes: 'Guiding candidates through preparatory catechism and fencing the Lord’s table with reverence.',
        keyConcepts: ['Sacramental Theology', 'Eucharistic Liturgy', 'Baptismal Catechesis'],
        ministryApplication: 'Provide pastoral counseling to believers with troubled consciences prior to communion.',
        reflectionQuestions: ['What pastoral safeguards should be observed during open versus closed communion services?'],
        downloadableMaterials: [{ title: 'Pastoral Liturgical Handbook (PDF)', type: 'PDF', size: '2.4 MB' }]
      }
    ]
  },

  // Cross-Cultural Missions (crs-miss-302)
  {
    id: 'mod-miss-1',
    courseId: 'crs-miss-302',
    order: 1,
    title: 'Module 1: The Missio Dei & Biblical Theology of Missions',
    description: 'From Genesis 12 to Revelation 7: God’s eternal covenant promise to redeem worshippers from every nation, tribe, and tongue.',
    lessons: [
      {
        id: 'les-miss-101',
        moduleId: 'mod-miss-1',
        courseId: 'crs-miss-302',
        order: 1,
        title: 'Lesson 1.1: The Great Commission in Global Perspective',
        introduction: 'The Great Commission is not a suggestion but the core mission of the global church until Christ returns.',
        scriptureReferences: ['Matthew 28:18-20', 'Acts 1:8', 'Revelation 7:9-10'],
        notes: 'Panta ta ethne signifies ethnolinguistic people groups rather than geopolitical nation-states.',
        keyConcepts: ['Missio Dei', 'Unreached People Groups (UPGs)', 'Ethnolinguistic Contextualization'],
        ministryApplication: 'Adopt an unreached people group for focused prayer and missionary sponsorship in your church.',
        reflectionQuestions: ['How does a proper understanding of Revelation 7 inspire endurance in difficult mission fields?'],
        downloadableMaterials: [{ title: 'Global Missiology Field Guide (PDF)', type: 'PDF', size: '3.1 MB' }]
      }
    ]
  },
  {
    id: 'mod-miss-2',
    courseId: 'crs-miss-302',
    order: 2,
    title: 'Module 2: Cross-Cultural Contextualization & Indigenous Models',
    description: 'Discerning between the timeless Gospel message and Western cultural wrappings to plant self-governing indigenous churches.',
    lessons: [
      {
        id: 'les-miss-201',
        moduleId: 'mod-miss-2',
        courseId: 'crs-miss-302',
        order: 1,
        title: 'Lesson 2.1: Contextualization without Syncretism',
        introduction: 'Translating biblical truth into indigenous forms without compromising theological orthodoxy.',
        scriptureReferences: ['1 Corinthians 9:19-23', 'Acts 17:22-31'],
        notes: 'Critical contextualization prevents syncretism while respecting local linguistic and cultural thought-patterns.',
        keyConcepts: ['Three-Self Formula', 'Critical Contextualization', 'Syncretism Prevention'],
        ministryApplication: 'Encourage local believers to write Christian worship songs in their native musical scales and poetry.',
        reflectionQuestions: ['How did the Apostle Paul adapt his preaching at the Areopagus without compromising repentance?'],
        downloadableMaterials: [{ title: 'Cross-Cultural Communication Manual (PDF)', type: 'PDF', size: '2.7 MB' }]
      }
    ]
  },

  // Pastoral Counseling (crs-coun-305)
  {
    id: 'mod-coun-1',
    courseId: 'crs-coun-305',
    order: 1,
    title: 'Module 1: Foundations of Biblical & Pastoral Counseling',
    description: 'The sufficiency of Scripture, the role of the Holy Spirit as Comforter (Parakletos), and ethical boundaries in pastoral care.',
    lessons: [
      {
        id: 'les-coun-101',
        moduleId: 'mod-coun-1',
        courseId: 'crs-coun-305',
        order: 1,
        title: 'Lesson 1.1: The Ministry of Christian Soul Care',
        introduction: 'Pastoral counseling integrates divine truth, empathetic listening, and prayer to minister to emotional and spiritual wounds.',
        scriptureReferences: ['2 Corinthians 1:3-7', 'Galatians 6:1-2'],
        notes: 'Distinguishing between spiritual oppression, emotional grief, and medical/biological afflictions requiring professional referral.',
        keyConcepts: ['Soul Care (Cura Animarum)', 'Active Empathetic Listening', 'Mandatory Reporting & Confidentiality'],
        ministryApplication: 'Establish a safe, confidential environment and know when to refer counselees to licensed Christian medical professionals.',
        reflectionQuestions: ['How does the doctrine of the Resurrection bring hope to clients suffering acute bereavement?'],
        downloadableMaterials: [{ title: 'Pastoral Counseling Intake Protocol (PDF)', type: 'PDF', size: '1.9 MB' }]
      }
    ]
  },
  {
    id: 'mod-coun-2',
    courseId: 'crs-coun-305',
    order: 2,
    title: 'Module 2: Grief, Bereavement, Trauma & Crisis Debriefing',
    description: 'Guiding individuals through sudden loss, traumatic crises, suicidal ideation assessment, and pastoral prayer.',
    lessons: [
      {
        id: 'les-coun-201',
        moduleId: 'mod-coun-2',
        courseId: 'crs-coun-305',
        order: 1,
        title: 'Lesson 2.1: Crisis Intervention & Trauma Shepherding',
        introduction: 'Providing stabilizing presence and gospel comfort in the immediate aftermath of tragedy and acute trauma.',
        scriptureReferences: ['Psalm 34:18', 'John 11:33-36'],
        notes: 'Presence often speaks louder than words in the acute stage of grief. Avoid trite cliches that minimize pain.',
        keyConcepts: ['Ministry of Presence', 'Trauma Assessment', 'Grief Stages in Biblical Light'],
        ministryApplication: 'Develop a rapid crisis response team in your church equipped for disaster and tragedy debriefing.',
        reflectionQuestions: ['Why did Jesus weep at Lazarus’s tomb even though He knew He was about to raise him from the dead?'],
        downloadableMaterials: [{ title: 'Grief Ministry Action Plan (PDF)', type: 'PDF', size: '1.5 MB' }]
      }
    ]
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-herm-1',
    courseId: 'crs-herm-301',
    courseName: 'Biblical Hermeneutics & Exegetical Method',
    title: 'Comprehensive Exegetical Paper: Romans 12:1-2',
    instructions: 'Prepare a 1,500-word formal exegetical paper on Romans 12:1-2. Include: (1) Historical & Literary Context, (2) Detailed grammatical analysis of "living sacrifice" (Greek: thysian zōsan) and "transformed by the renewing of your mind", (3) Theological synthesis, and (4) 3 pastoral applications for the contemporary church.',
    dueDate: '2026-09-15',
    maxMarks: 100,
    rubric: [
      { criteria: 'Historical & Literary Context', points: 25 },
      { criteria: 'Original Language & Word Analysis', points: 30 },
      { criteria: 'Theological Accuracy & Synthesis', points: 25 },
      { criteria: 'Practical Homiletic/Ministry Application & Formatting', points: 20 },
    ],
    submissionsCount: 28,
    status: 'Open'
  },
  {
    id: 'asg-theo-1',
    courseId: 'crs-theo-201',
    courseName: 'Systematic Theology I',
    title: 'Doctrinal Defense of the Trinity Against Modalism & Arianism',
    instructions: 'Write a 2,000-word theological treatise defending the Nicene-Constantinopolitan formulation of the Triune Godhead (One Ousia, Three Hypostaseis) using both Old and New Testament evidence.',
    dueDate: '2026-09-28',
    maxMarks: 100,
    rubric: [
      { criteria: 'Biblical Scriptural Proofs', points: 35 },
      { criteria: 'Historical Theological Precision', points: 35 },
      { criteria: 'Refutation of Ancient & Modern Heresies', points: 30 },
    ],
    submissionsCount: 34,
    status: 'Open'
  }
];

export const INITIAL_EXAMINATIONS: Examination[] = [
  {
    id: 'exam-herm-mid',
    code: 'EXAM-BIB301-MID',
    courseId: 'crs-herm-301',
    courseCode: 'BIB-301',
    courseTitle: 'Biblical Hermeneutics & Exegetical Method',
    title: 'Mid-Term Comprehensive Examination in Biblical Hermeneutics',
    instructions: 'This is a timed, proctored university examination. You will have 45 minutes to complete 10 questions spanning exegesis, Greek vocabulary, historical context, and ministry application. All answers are auto-saved in real time. Do not close your browser.',
    durationMinutes: 45,
    totalMarks: 100,
    passMarks: 70,
    status: 'Active',
    scheduledDate: 'Fall Semester 2026',
    chiefExaminer: 'Dr. Thomas E. Wright, Ph.D.',
    questions: [
      {
        id: 'q-1',
        courseId: 'crs-herm-301',
        topic: 'Hermeneutical Terminology',
        type: 'multiple_choice',
        prompt: 'Which Greek term literally means "to lead out" or "draw out of the text", signifying the objective discovery of the biblical author\'s intended meaning?',
        options: ['Eisegesis', 'Exegesis', 'Apologia', 'Hermeneia'],
        correctAnswerIndex: 1,
        points: 10,
        explanation: 'Exegesis (from Greek exēgeomai) means reading out of the text what is there, whereas Eisegesis means reading subjective human notions into the text.',
        difficulty: 'Easy'
      },
      {
        id: 'q-2',
        courseId: 'crs-herm-301',
        topic: 'Inspiration of Scripture',
        type: 'multiple_choice',
        prompt: 'Which theological doctrine affirms that every single word (verbal) and all parts of the biblical canon (plenary) are divinely inspired by the Holy Spirit?',
        options: ['Mechanical Dictation', 'Verbal Plenary Inspiration', 'Neo-Orthodox Illumination', 'Conceptual Inspiration'],
        correctAnswerIndex: 1,
        points: 10,
        explanation: 'Verbal Plenary Inspiration maintains that God guided the human authors so that the exact words written represent His truth without error, while preserving their human style.',
        difficulty: 'Medium'
      },
      {
        id: 'q-3',
        courseId: 'crs-herm-301',
        topic: 'Hermeneutical Principles',
        type: 'true_false',
        prompt: 'True or False: Because Old Testament narratives record historical events, everything done by biblical patriarchs (e.g. Jacob’s deception, David’s census) is prescriptive for believers today.',
        options: ['True', 'False'],
        correctAnswerIndex: 1,
        points: 10,
        explanation: 'False. Biblical narratives are primarily descriptive (recording what happened), not automatically prescriptive (commanding what believers must do).',
        difficulty: 'Easy'
      },
      {
        id: 'q-4',
        courseId: 'crs-herm-301',
        topic: 'Scripture Reference Matching',
        type: 'scripture_match',
        prompt: 'Which scripture verse instructs the minister to: "Do your best to present yourself to God as one approved, a worker who does not need to be ashamed and who correctly handles the word of truth"?',
        options: ['2 Timothy 2:15', 'Hebrews 4:12', 'James 1:22', 'Revelation 1:3'],
        correctAnswerIndex: 0,
        points: 10,
        explanation: '2 Timothy 2:15 is the classic foundational exhortation for diligent biblical study and handling (orthotomeō) the Word of Truth.',
        difficulty: 'Easy'
      },
      {
        id: 'q-5',
        courseId: 'crs-herm-301',
        topic: 'Genre Analysis',
        type: 'multiple_choice',
        prompt: 'The Book of Revelation and portions of Daniel 7-12 belong primarily to which literary genre characterized by symbolic imagery, angelic guides, and cosmic dualism?',
        options: ['Historical Narrative', 'Wisdom Literature', 'Apocalyptic Literature', 'Pastoral Epistles'],
        correctAnswerIndex: 2,
        points: 10,
        explanation: 'Apocalyptic literature uses vivid symbolism and heavenly revelations to encourage believers under extreme crisis that God reigns supreme over history.',
        difficulty: 'Medium'
      },
      {
        id: 'q-6',
        courseId: 'crs-herm-301',
        topic: 'Analogy of Faith',
        type: 'multiple_choice',
        prompt: 'The Reformation principle of "Analogia Fidei" (Analogy of Faith / Scripture interprets Scripture) dictates that:',
        options: [
          'Tradition overrules written texts',
          'Obscure or difficult passages should be interpreted in light of clear, unambiguous passages',
          'Modern psychology determines scripture relevance',
          'Only church councils may interpret dogma'
        ],
        correctAnswerIndex: 1,
        points: 10,
        explanation: 'The Analogy of Faith asserts that because Scripture is inspired by one Holy Spirit, it does not contradict itself; hence clear passages govern unclear passages.',
        difficulty: 'Medium'
      },
      {
        id: 'q-7',
        courseId: 'crs-herm-301',
        topic: 'Greek Word Analysis',
        type: 'multiple_choice',
        prompt: 'In John 1:1, the Greek term "Logos" applied to Jesus Christ represents Him as the:',
        options: [
          'Eternal Divine Word / Expression of God',
          'Created Angelic Messenger',
          'Temporary Voice',
          'Human prophet only'
        ],
        correctAnswerIndex: 0,
        points: 10,
        explanation: 'In John 1:1, Logos is eternally with God and is God, identifying the Second Person of the Trinity incarnate in Jesus Christ.',
        difficulty: 'Easy'
      },
      {
        id: 'q-8',
        courseId: 'crs-herm-301',
        topic: 'Contextual Horizons',
        type: 'true_false',
        prompt: 'True or False: A biblical text can mean whatever the modern reader feels it means in their personal emotional state, regardless of the original author\'s intent.',
        options: ['True', 'False'],
        correctAnswerIndex: 1,
        points: 10,
        explanation: 'False. A text cannot mean what it never meant to the original author and recipients. Personal application must flow from original contextual meaning.',
        difficulty: 'Easy'
      },
      {
        id: 'q-9',
        courseId: 'crs-herm-301',
        topic: 'Historical Geography',
        type: 'multiple_choice',
        prompt: 'In Luke 10 (The Good Samaritan), the journey from Jerusalem down to Jericho descended roughly 3,300 feet through a notorious desert canyon known as the:',
        options: ['Way of the Sea', 'Pass of Blood / Adummim', 'Valley of Jezreel', 'King’s Highway'],
        correctAnswerIndex: 1,
        points: 10,
        explanation: 'The road descended through the Ascent of Adummim ("Pass of Blood"), notoriously dangerous for travelers due to caves harboring armed bandits.',
        difficulty: 'Advanced'
      },
      {
        id: 'q-10',
        courseId: 'crs-herm-301',
        topic: 'Ministry Application',
        type: 'short_essay',
        prompt: 'Briefly explain in 2-3 sentences why an expository preacher must distinguish between the "meaning" of a text and its "application" for a modern congregation.',
        correctAnswerText: 'Meaning is singular, objective, and tied permanently to the author’s original intent. Application is multifaceted and represents how that immutable truth touches varied life situations today.',
        points: 10,
        explanation: 'Meaning is fixed by the historical text; application is how that single theological principle is lived out in diverse modern contexts.',
        difficulty: 'Medium'
      }
    ]
  }
];

export const INITIAL_GRADES: GradeRecord[] = [
  {
    id: 'grd-1',
    studentId: 'usr-student-1',
    courseId: 'crs-theo-201',
    courseCode: 'THE-201',
    courseTitle: 'Systematic Theology I: Doctrine of God',
    creditHours: 3,
    semester: 'Spring 2026',
    year: 2026,
    assignmentScore: 94,
    quizScore: 92,
    examScore: 95,
    totalScore: 94,
    letterGrade: 'A',
    gradePoint: 4.0
  },
  {
    id: 'grd-2',
    studentId: 'usr-student-1',
    courseId: 'crs-past-401',
    courseCode: 'PAS-401',
    courseTitle: 'Pastoral Ministry & Expository Homiletics',
    creditHours: 3,
    semester: 'Spring 2026',
    year: 2026,
    assignmentScore: 88,
    quizScore: 89,
    examScore: 91,
    totalScore: 89,
    letterGrade: 'B+',
    gradePoint: 3.3
  },
  {
    id: 'grd-3',
    studentId: 'usr-student-1',
    courseId: 'crs-miss-302',
    courseCode: 'MIS-302',
    courseTitle: 'Cross-Cultural Missions & Church Planting',
    creditHours: 3,
    semester: 'Fall 2025',
    year: 2025,
    assignmentScore: 96,
    quizScore: 95,
    examScore: 98,
    totalScore: 96,
    letterGrade: 'A',
    gradePoint: 4.0
  }
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-1',
    certificateNumber: 'BIBU-2024-BTH-8821',
    studentId: 'usr-student-1',
    studentName: 'David Emmanuel',
    programName: 'Bachelor of Theology (B.Th)',
    degreeTitle: 'Bachelor of Theology',
    schoolName: 'School of Theological Studies',
    conferralDate: 'June 18, 2026',
    honors: 'Summa Cum Laude',
    verificationCode: 'VRF-8821-BTH-AZ',
    status: 'Valid',
    chancellorName: 'Dr. Michael C. Sterling, Th.D.',
    registrarName: 'Rev. Dr. Sarah M. Jenkins, Th.D.'
  },
  {
    id: 'cert-2',
    certificateNumber: 'BIBU-2023-DMIN-3109',
    studentId: 'usr-alumni-1',
    studentName: 'Joshua K. Osei',
    programName: 'Doctor of Ministry (D.Min)',
    degreeTitle: 'Doctor of Ministry in Global Missions Leadership',
    schoolName: 'School of Christian Ministry',
    conferralDate: 'November 12, 2023',
    honors: 'With High Distinction',
    verificationCode: 'VRF-3109-DMIN-AZ',
    status: 'Valid',
    chancellorName: 'Dr. Michael C. Sterling, Th.D.',
    registrarName: 'Rev. Dr. Sarah M. Jenkins, Th.D.'
  }
];

export const INITIAL_LIBRARY_RESOURCES: LibraryResource[] = [
  {
    id: 'lib-1',
    title: 'The Great Commission in the 21st Century: Global Missiology & Unreached Peoples',
    author: 'Dr. Samuel Boateng & Dr. Michael Sterling',
    category: 'Missions',
    format: 'PDF',
    pagesOrDuration: '342 pages',
    year: 2024,
    description: 'A groundbreaking missiological analysis of unreached ethnic clusters and indigenous leadership multiplication strategies across Sub-Saharan Africa and Asia.',
    coverColor: 'bg-emerald-900',
    isPopular: true
  },
  {
    id: 'lib-2',
    title: 'Grammatical-Historical Exegesis: A Practitioner’s Guide to NT Greek',
    author: 'Dr. Thomas E. Wright, Ph.D.',
    category: 'Biblical Studies',
    format: 'PDF',
    pagesOrDuration: '280 pages',
    year: 2023,
    description: 'Practical handbook for pastors dissecting syntax, lexical semantics, verbal aspect, and discourse analysis in the Greek New Testament.',
    coverColor: 'bg-indigo-950',
    isPopular: true
  },
  {
    id: 'lib-3',
    title: 'Systematic Dogmatics: The Attributes & Holiness of God',
    author: 'Dr. Jonathan Vance, Th.D.',
    category: 'Theology',
    format: 'Book Excerpt',
    pagesOrDuration: '412 pages',
    year: 2022,
    description: 'In-depth treatise on the classical attributes of God, divine aseity, immutability, impassibility, and eternal Trinitarian communion.',
    coverColor: 'bg-blue-900',
    isPopular: true
  },
  {
    id: 'lib-4',
    title: 'Pastoral Crisis, Bereavement & Trauma Care Protocols',
    author: 'Dr. Elizabeth R. Montgomery',
    category: 'Christian Counseling',
    format: 'PDF',
    pagesOrDuration: '198 pages',
    year: 2025,
    description: 'Ethical, legal, and biblical counseling guidelines for bereavement support, domestic crisis intervention, and post-disaster institutional chaplaincy.',
    coverColor: 'bg-teal-900',
    isPopular: true
  },
  {
    id: 'lib-5',
    title: 'Audio Lecture: The Council of Nicaea and Christology (A.D. 325)',
    author: 'Dr. Jonathan Vance',
    category: 'Church History',
    format: 'Audio Lecture',
    pagesOrDuration: '52 mins',
    year: 2024,
    description: 'Historical exploration of Athanasius versus Arius, the formulation of homoousios, and the preservation of orthodox Christology.',
    coverColor: 'bg-amber-950',
  },
  {
    id: 'lib-6',
    title: 'Biblical Governance and Non-Profit Financial Integrity in Ministry',
    author: 'Dr. Marcus Vance, Ph.D.',
    category: 'Leadership',
    format: 'Journal',
    pagesOrDuration: '45 pages',
    year: 2025,
    description: 'Audit protocols, board fiduciary governance, and transparent stewardship principles for modern international church organizations.',
    coverColor: 'bg-slate-900',
  },
  {
    id: 'lib-7',
    title: 'Covenant Theology and Old Testament Typology in the Prophets',
    author: 'Dr. Thomas E. Wright, Ph.D.',
    category: 'Theology',
    format: 'PDF',
    pagesOrDuration: '310 pages',
    year: 2023,
    description: 'An exegetical survey tracing the Abrahamic, Mosaic, Davidic, and New Covenants with focused Messianic typologies in Isaiah and Jeremiah.',
    coverColor: 'bg-blue-950',
    isPopular: true
  },
  {
    id: 'lib-8',
    title: 'Expository Preaching in Multi-Cultural Congregations',
    author: 'Rev. Dr. Robert Lindqvist, D.Min.',
    category: 'Leadership',
    format: 'PDF',
    pagesOrDuration: '225 pages',
    year: 2024,
    description: 'Methodology for bridging redemptive-historical sermon outlines into diverse urban and international ministry contexts.',
    coverColor: 'bg-indigo-900',
  },
  {
    id: 'lib-9',
    title: 'Audio Lecture: Patristic Apologetics & The Early Martyrs',
    author: 'Dr. Jonathan Vance',
    category: 'Church History',
    format: 'Audio Lecture',
    pagesOrDuration: '48 mins',
    year: 2023,
    description: 'Examines Justin Martyr, Tertullian, and Polycarp, and the defense of the Christian faith in the Greco-Roman Empire.',
    coverColor: 'bg-amber-900',
  },
  {
    id: 'lib-10',
    title: 'Foundations of Hebrew Lexicography & Syntax for Old Testament Exegesis',
    author: 'Dr. David K. Mensah',
    category: 'Biblical Studies',
    format: 'PDF',
    pagesOrDuration: '360 pages',
    year: 2025,
    description: 'Essential reference guide for parsing Classical Hebrew verbs, construct states, and poetic parallelism in the Psalms and Wisdom Literature.',
    coverColor: 'bg-slate-800',
    isPopular: true
  },
  {
    id: 'lib-11',
    title: 'Family Systems and Adolescent Pastoral Counseling',
    author: 'Dr. Elizabeth R. Montgomery',
    category: 'Christian Counseling',
    format: 'PDF',
    pagesOrDuration: '240 pages',
    year: 2024,
    description: 'Theological and therapeutic frameworks for addressing family conflict, generational boundaries, and spiritual formation in youth.',
    coverColor: 'bg-teal-950',
  },
  {
    id: 'lib-12',
    title: 'Academic Theological Research & Thesis Methodology Manual',
    author: 'Dr. Deborah K. Alvarez, D.Min.',
    category: 'Research',
    format: 'PDF',
    pagesOrDuration: '175 pages',
    year: 2025,
    description: 'Standards of Turabian formatting, bibliographic citation, peer-reviewed source evaluation, and doctrinal thesis defense.',
    coverColor: 'bg-stone-900',
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-001',
    applicationNumber: 'BIBU-APP-2026-9041',
    fullName: 'Pastor Gabriel Mwangi',
    email: 'g.mwangi@faithchapel.org',
    phone: '+254 712 884 920',
    dateOfBirth: '1982-04-14',
    gender: 'Male',
    nationality: 'Kenyan',
    country: 'Kenya',
    churchAffiliation: 'Faith International Chapel, Nairobi',
    ministryExperienceYears: 12,
    currentMinistryRole: 'Lead Pastor & Church Planter',
    desiredProgramId: 'prog-mcm',
    desiredProgramName: 'Master of Christian Ministry (M.C.M)',
    previousEducation: 'Bachelor of Arts in Theology, Daystar University (2010)',
    statementOfPurpose: 'I seek to refine my strategic leadership to oversee regional church expansion across East Africa and mentor younger generation pastors.',
    referenceName: 'Bishop Peter Kamau',
    referenceContact: 'pkamau@eastafricamissions.org',
    status: 'Under Review',
    submittedDate: '2026-08-14',
    documents: [
      { name: 'Degree_Certificate_BA.pdf', type: 'application/pdf', size: '2.1 MB' },
      { name: 'Pastoral_Ordination_Letter.pdf', type: 'application/pdf', size: '1.4 MB' },
      { name: 'Passport_Scan.pdf', type: 'application/pdf', size: '980 KB' }
    ]
  },
  {
    id: 'app-002',
    applicationNumber: 'BIBU-APP-2026-9042',
    fullName: 'Minister Rachel Brooks',
    email: 'rachel.brooks@gmail.com',
    phone: '+1 (480) 555-0199',
    dateOfBirth: '1991-11-20',
    gender: 'Female',
    nationality: 'American',
    country: 'United States',
    churchAffiliation: 'Desert Stream Church, Scottsdale, AZ',
    ministryExperienceYears: 5,
    currentMinistryRole: 'Director of Women & Family Ministries',
    desiredProgramId: 'prog-mcc',
    desiredProgramName: 'Master of Christian Counseling (M.C.C)',
    previousEducation: 'B.S. in Psychology, Arizona State University (2014)',
    statementOfPurpose: 'To integrate sound biblical counseling with trauma-informed pastoral care to help families in crisis in our local church and city.',
    referenceName: 'Pastor Mark Thornton',
    referenceContact: 'mthornton@desertstream.org',
    status: 'Accepted',
    submittedDate: '2026-08-18',
    documents: [
      { name: 'ASU_Transcript.pdf', type: 'application/pdf', size: '1.8 MB' },
      { name: 'Recommendation_Letter.pdf', type: 'application/pdf', size: '850 KB' }
    ]
  }
];

export const INITIAL_RPL_APPLICATIONS: RPLApplication[] = [
  {
    id: 'rpl-001',
    applicationNumber: 'BIBU-RPL-2026-104',
    applicantName: 'Evangelist Marcus Sterling Davis',
    email: 'm.davis@worldoutreach.net',
    phone: '+1 (615) 880-3321',
    targetProgram: 'Bachelor of Christian Ministry (B.C.M)',
    yearsInMinistry: 18,
    ministryField: 'Frontier Crusades & Prison Outreach',
    portfolioSummary: 'Conducted over 120 city-wide evangelistic crusades across 14 nations, authored 2 discipleship training manuals, ordained 24 local pastors.',
    evidenceItems: [
      { title: '18-Year Ministry Record & Verification', category: 'Ministry Experience', description: 'Certified letters from regional denomination superintendents.' },
      { title: 'Discipleship Curriculum Sample', category: 'Teaching Material', description: 'Complete 12-week convert follow-up manual.' },
      { title: 'Crusade & Ordination Video Archives', category: 'Media Evidence', description: 'Links to televised crusades and missionary reports.' }
    ],
    requestedCredits: 36,
    approvedCredits: 30,
    status: 'Credits Awarded',
    assessorName: 'Dr. Deborah K. Alverez, D.Min.',
    assessorNotes: 'Candidate demonstrates extensive real-world homiletic and church growth expertise. Awarded 30 credits towards practical ministry requirements.',
    dateSubmitted: '2026-07-22'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Fall 2026 Global Academic Session Commencement & Convocation',
    category: 'Academic',
    content: 'All enrolled students across our 9 Schools are invited to the Global Online Convocation live streamed on September 1, 2026. Please verify your course enrollments in the portal.',
    date: 'August 20, 2026',
    author: 'Office of Academic Affairs'
  },
  {
    id: 'ann-2',
    title: 'Mid-Term Online Examination Schedules Published',
    category: 'Examination',
    content: 'The Mid-Term exam timetable is now active. Students must ensure stable internet connectivity and review proctoring guidelines before starting exams.',
    date: 'August 18, 2026',
    isUrgent: true,
    author: 'Chief Examination Office'
  },
  {
    id: 'ann-3',
    title: '28th Annual Graduation Ceremony — Phoenix Campus & Global Broadcast',
    category: 'Graduation',
    content: 'Graduation applications for Fall 2026 are now open. Eligible students must submit their clearance by October 15, 2026.',
    date: 'August 10, 2026',
    author: 'Office of the Registrar'
  }
];

export const INITIAL_FINANCIALS: FinancialTransaction[] = [
  {
    id: 'fin-1',
    invoiceNumber: 'INV-2026-4401',
    studentId: 'usr-student-1',
    studentName: 'David Emmanuel',
    description: 'Fall 2026 Tuition Fee (12 Credit Hours)',
    amount: 800,
    type: 'Tuition Fee',
    status: 'Paid',
    date: '2026-08-05',
    paymentMethod: 'Credit Card (Visa)'
  },
  {
    id: 'fin-2',
    invoiceNumber: 'INV-2026-4402',
    studentId: 'usr-student-1',
    studentName: 'David Emmanuel',
    description: 'Digital Theological Library & Technology Fee',
    amount: 150,
    type: 'Library & Technology Fee',
    status: 'Paid',
    date: '2026-08-05',
    paymentMethod: 'Credit Card (Visa)'
  },
  {
    id: 'fin-3',
    invoiceNumber: 'INV-2026-4890',
    studentId: 'usr-student-1',
    studentName: 'David Emmanuel',
    description: 'Mid-Term Examination & Assessment Fee',
    amount: 450,
    type: 'Examination Fee',
    status: 'Pending',
    date: '2026-08-20'
  }
];

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-1',
    ticketNumber: 'TKT-8891',
    studentId: 'usr-student-1',
    studentName: 'David Emmanuel',
    category: 'Academic Advising',
    subject: 'Request for Greek Language Elective approval',
    message: 'Greetings Dr. Wright. I wish to register for Biblical Greek II as an elective in the upcoming spring term to assist in my thesis exegesis.',
    priority: 'Medium',
    status: 'In Progress',
    createdAt: '2026-08-19',
    responses: [
      {
        sender: 'Dr. Thomas E. Wright',
        message: 'Dear Pastor David, your prerequisite records have been reviewed and approved. The registrar has been authorized to enroll you.',
        date: '2026-08-20',
        isStaff: true
      }
    ]
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'BIBU-INV-2026-0881',
    studentId: 'usr-student-1',
    studentName: 'Pastor David Emmanuel',
    description: 'Fall 2026 Semester Tuition (12 Credits)',
    amountUSD: 1200,
    dueDate: '2026-09-15',
    status: 'Paid',
    paidDate: '2026-08-10',
    paymentMethod: 'Visa Card •••• 4242'
  },
  {
    id: 'inv-2',
    invoiceNumber: 'BIBU-INV-2026-0942',
    studentId: 'usr-student-1',
    studentName: 'Pastor David Emmanuel',
    description: 'Theological Library & Technology Resource Fee',
    amountUSD: 150,
    dueDate: '2026-09-15',
    status: 'Paid',
    paidDate: '2026-08-10',
    paymentMethod: 'Visa Card •••• 4242'
  },
  {
    id: 'inv-3',
    invoiceNumber: 'BIBU-INV-2026-1033',
    studentId: 'usr-student-1',
    studentName: 'Pastor David Emmanuel',
    description: 'Mid-Term Comprehensive Exam & Proctoring Fee',
    amountUSD: 450,
    dueDate: '2026-10-01',
    status: 'Pending'
  }
];
