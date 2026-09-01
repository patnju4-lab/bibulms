import { Bulletin, BulletinCategory } from '../types';

export const INITIAL_BULLETIN_CATEGORIES: BulletinCategory[] = [
  'University News',
  'Academic Notices',
  'Examination Notices',
  'Admissions',
  'Student Affairs',
  'Faculty & Staff',
  'Graduation',
  'Events',
  'Scholarships',
  'Research & Publications',
  'Alumni',
  'Ministry & Christian Leadership',
  'Emergency Notices'
];

export const INITIAL_BULLETIN_DEPARTMENTS: string[] = [
  "Registrar's Office",
  'Office of Academic Affairs',
  'Chief Examination Directorate',
  "Chancellor's Executive Office",
  'Admissions Directorate',
  'University Financial Aid & Bursar',
  'Academic Senate & Deans Council',
  'Global Ministerial Network & Missions',
  'Postgraduate Research Directorate',
  'School of Biblical & Theological Studies',
  'Student Affairs & Chaplaincy'
];

export const INITIAL_BULLETINS: Bulletin[] = [
  {
    id: 'bul-001',
    bulletinNumber: 'BIBU/BUL/2026/001',
    verificationCode: 'BIBU-VRF-2026-000001',
    title: '2026/2027 Academic Year Admissions Now Open',
    subtitle: 'Fall & Spring Cohorts Open Across Certificate, Bachelor, Master & Doctoral Degree Programs',
    category: 'Admissions',
    department: "Registrar's Office",
    author: 'Rev. Dr. Sarah M. Jenkins, Th.D.',
    authorRole: 'University Registrar',
    priority: 'Important',
    targetAudience: 'Everyone',
    status: 'Published',
    publishDate: 'August 24, 2026',
    publishTime: '08:00 AM MST',
    year: 2026,
    isFeatured: true,
    viewsCount: 1420,
    downloadsCount: 388,
    featuredImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    summary:
      'The Academic Senate and Directorate of Admissions of Breakthrough International Bible University formally announce the commencement of admissions for the 2026/2027 academic session. Applications are now accepted for all 9 collegiate schools and online degree pathways.',
    content: `
### OFFICIAL COMMENCEMENT OF 2026/2027 ADMISSIONS

The Office of the Academic Registrar, under the authority of the Chancellor and the Board of Regents of Breakthrough International Bible University (BIBU), hereby notifies all prospective students, ordained ministers, pastors, Christian workers, and theological scholars worldwide that application portals for the **2026/2027 Academic Year** are officially active.

#### 1. Available Degree Levels & Programs
Applications are invited across our nine distinguished schools:
* **School of Biblical & Theological Studies**: B.Th, M.Div, Th.D., Ph.D. in Biblical Studies
* **School of Christian Ministry & Pastoral Leadership**: B.C.M, M.C.M, Doctor of Ministry (D.Min)
* **School of Global Missions & Evangelism**: Diploma, Bachelor, and Master tracks
* **School of Christian Counseling & Family Therapy**: Master of Christian Counseling (M.C.C)
* **School of Christian Education & Leadership**: Graduate Certificates & Master Degrees

#### 2. Recognition of Prior Learning (RPL) Credit
Ordained ministers and experienced Christian workers with documented pastoral or cross-cultural ministry track records may apply for the **BIBU RPL Ministry Assessment**, eligible for up to 36 advanced standing credit hours toward undergraduate and graduate requirements.

#### 3. Financial Aid & Global Kingdom Scholarships
Under the Chancellor's Global Leadership Initiative, partial tuition relief grants are available to applicants residing in developing nations, active missionaries in frontier regions, and full-time senior pastors of newly planted churches.
    `,
    importantDates: [
      { label: 'Priority Application Deadline', date: 'September 15, 2026' },
      { label: 'RPL Portfolio Evaluation Cut-off', date: 'September 25, 2026' },
      { label: 'Orientation & Convocation', date: 'October 01, 2026' },
      { label: 'Fall Term Classes Begin', date: 'October 05, 2026' }
    ],
    instructions: [
      'Navigate to the Online Admissions portal on the official BIBU website.',
      'Submit high school, diploma, or previous university academic transcripts.',
      'Provide one pastoral/ecclesiastical letter of recommendation.',
      'Upload a 500-word Statement of Spiritual Journey & Ministry Calling.'
    ],
    attachments: [
      { name: 'BIBU_Prospectus_2026_2027.pdf', type: 'PDF Document', size: '3.4 MB' },
      { name: 'Admissions_Application_Guide.pdf', type: 'PDF Document', size: '1.2 MB' },
      { name: 'Fee_Schedule_and_Scholarship_Form.pdf', type: 'PDF Document', size: '840 KB' }
    ],
    links: [
      { label: 'Apply for 2026/2027 Admissions', url: 'admissions' },
      { label: 'Explore 9 Schools & Degree Programs', url: 'programs' }
    ],
    contactInfo: {
      department: 'Directorate of International Admissions',
      email: 'admissions@bibu-edu.org',
      phone: '+1 (602) 845-9200',
      officeLocation: 'Suite 500, University Parkway, Phoenix, AZ 85034'
    },
    authorizedSignatory: {
      name: 'Rev. Dr. Sarah M. Jenkins, Th.D.',
      title: 'University Academic Registrar',
      signatureText: 'S. M. Jenkins, Th.D.'
    },
    createdAt: '2026-08-24T08:00:00Z',
    createdBy: 'Rev. Dr. Sarah M. Jenkins',
    approvedBy: 'Dr. Michael C. Sterling, Th.D.',
    approvedAt: '2026-08-24T08:30:00Z',
    auditLogs: [
      { action: 'Created', user: 'Rev. Dr. Sarah M. Jenkins', timestamp: '2026-08-24 07:45 MST', notes: 'Drafted 2026/2027 admissions official notice' },
      { action: 'Approved', user: 'Dr. Michael C. Sterling', timestamp: '2026-08-24 08:15 MST', notes: 'Executive approval granted' },
      { action: 'Published', user: 'Rev. Dr. Sarah M. Jenkins', timestamp: '2026-08-24 08:30 MST', notes: 'Broadcasted to public portal and student LMS' }
    ]
  },
  {
    id: 'bul-002',
    bulletinNumber: 'BIBU/BUL/2026/002',
    verificationCode: 'BIBU-VRF-2026-000002',
    title: 'Student Semester Registration Notice',
    subtitle: 'Course Selection, Degree Audit Verification & LMS Enrollment Confirmation',
    category: 'Academic Notices',
    department: 'Office of Academic Affairs',
    author: 'Prof. Jonathan Vance, Th.D.',
    authorRole: 'Dean of Academic Affairs',
    priority: 'Important',
    targetAudience: 'All Students',
    status: 'Published',
    publishDate: 'August 22, 2026',
    publishTime: '09:30 AM MST',
    year: 2026,
    isFeatured: false,
    viewsCount: 980,
    downloadsCount: 245,
    featuredImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
    summary:
      'All continuing and newly matriculated students are required to complete online course registrations for the upcoming term before the published deadline to ensure access to lecture notes, virtual classrooms, and assignment dropboxes.',
    content: `
### MANDATORY SEMESTER COURSE REGISTRATION PROTOCOLS

The Office of Academic Affairs hereby issues general directives regarding course enrollments for the Fall 2026 trimester. Every student enrolled in certificate, diploma, undergraduate, or graduate tracks must log into the Student Learning Portal and complete their syllabus selections.

#### 1. Minimum & Maximum Credit Loads
* **Full-Time Undergraduates**: 12 to 18 Credit Hours (4 to 6 course modules)
* **Part-Time / Ministry Candidates**: 6 to 9 Credit Hours (2 to 3 course modules)
* **Graduate & Doctoral Candidates**: 9 to 12 Credit Hours per semester

#### 2. Degree Audit & Prerequisite Check
Prior to confirming registrations, candidates are urged to view their unofficial Academic Transcript in the student dashboard to verify that all prerequisite courses (e.g., *HERM-301* prior to *EXEG-402*) have been passed with a grade of 'C' or higher.

#### 3. Course Add/Drop Period
Students may modify their enrolled course schedule without academic penalty during the first two weeks of the semester through the online registrar interface.
    `,
    importantDates: [
      { label: 'Registration System Opens', date: 'August 20, 2026' },
      { label: 'Late Registration Fee Begins', date: 'September 10, 2026' },
      { label: 'Add/Drop Deadline', date: 'September 20, 2026' }
    ],
    instructions: [
      'Log into the Student Portal using your BIBU credentials.',
      'Click on "Current Semester Courses" and review recommended modules.',
      'Ensure your financial clearance is verified with the Bursar.',
      'Click "Confirm Semester Enrollment" to generate your semester course slip.'
    ],
    attachments: [
      { name: 'Semester_Course_Schedule_Fall2026.pdf', type: 'PDF Document', size: '2.1 MB' },
      { name: 'Academic_Advising_Worksheet.pdf', type: 'PDF Document', size: '750 KB' }
    ],
    links: [
      { label: 'Open Student Learning Portal', url: 'student-dashboard' }
    ],
    contactInfo: {
      department: 'Office of Academic Affairs & Advising',
      email: 'academics@bibu-edu.org',
      phone: '+1 (602) 845-9204'
    },
    authorizedSignatory: {
      name: 'Prof. Jonathan Vance, Th.D.',
      title: 'Dean of Academic Affairs',
      signatureText: 'Prof. J. Vance'
    },
    createdAt: '2026-08-22T09:00:00Z',
    createdBy: 'Prof. Jonathan Vance',
    approvedBy: 'Rev. Dr. Sarah M. Jenkins',
    approvedAt: '2026-08-22T09:30:00Z',
    auditLogs: [
      { action: 'Created', user: 'Prof. Jonathan Vance', timestamp: '2026-08-22 09:00 MST' },
      { action: 'Published', user: 'Rev. Dr. Sarah M. Jenkins', timestamp: '2026-08-22 09:30 MST' }
    ]
  },
  {
    id: 'bul-003',
    bulletinNumber: 'BIBU/BUL/2026/003',
    verificationCode: 'BIBU-VRF-2026-000003',
    title: '2026 Examination Registration and Timetable',
    subtitle: 'Comprehensive Mid-Term & Final Proctored Assessment Schedules Published',
    category: 'Examination Notices',
    department: 'Chief Examination Directorate',
    author: 'Dr. Deborah K. Alvarez, D.Min.',
    authorRole: 'Chief University Examiner',
    priority: 'Urgent',
    targetAudience: 'All Students',
    status: 'Published',
    publishDate: 'August 18, 2026',
    publishTime: '11:00 AM MST',
    year: 2026,
    isFeatured: false,
    viewsCount: 1850,
    downloadsCount: 620,
    featuredImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80',
    summary:
      'The Chief Examination Directorate has released the comprehensive 2026 examination timetable. Students must register their assessment cohorts, verify digital proctoring compatibility, and review anti-plagiarism guidelines.',
    content: `
### OFFICIAL 2026 EXAMINATION TIMETABLE & PROCTORING GUIDELINES

The Chief Examination Directorate, in consultation with the Academic Moderation Board, hereby announces the finalized schedule for the **2026 Mid-Term and Comprehensive Final Examinations**.

#### 1. Digital Examination Protocols
* All examinations are conducted via the secure BIBU Online Examination Room.
* Each timed paper includes auto-saving question responses and a cryptographic submission timestamp.
* Candidates are expected to uphold the highest standards of Christian honor and academic integrity. Unapproved resources and unauthorized assistance are strictly prohibited.

#### 2. Minimum Passing Thresholds
* **Certificate & Diploma**: 60% Passing Mark
* **Bachelor Degrees (B.Th, B.C.M)**: 65% Passing Mark
* **Graduate & Master (M.Div, M.C.M)**: 70% Passing Mark
* **Doctoral Comprehensive Exams**: 75% Passing Mark (with oral defense)

#### 3. Examination Timetable Overview
| Course Code | Examination Title | Duration | Date & Window |
|---|---|---|---|
| HERM-301 | Biblical Hermeneutics & Exegesis | 90 Mins | October 12, 2026 |
| THEO-201 | Systematic Theology & Christology | 120 Mins | October 14, 2026 |
| LEAD-401 | Pastoral Ethics & Church Governance | 90 Mins | October 16, 2026 |
| MISS-302 | Cross-Cultural Missions & Church Planting | 90 Mins | October 19, 2026 |
    `,
    importantDates: [
      { label: 'Exam Candidate Registration Deadline', date: 'September 28, 2026' },
      { label: 'Proctoring System Test Window', date: 'October 01–05, 2026' },
      { label: 'Examination Period', date: 'October 12–24, 2026' },
      { label: 'Results Publication', date: 'November 08, 2026' }
    ],
    instructions: [
      'Ensure high-speed internet connectivity before launching the Exam Room.',
      'Do not refresh or navigate away from the test interface during an active countdown.',
      'Review all multiple-choice and short-essay theological questions before submitting.'
    ],
    attachments: [
      { name: 'BIBU_Examination_Timetable_2026.pdf', type: 'PDF Document', size: '1.9 MB' },
      { name: 'Student_Exam_Code_of_Conduct.pdf', type: 'PDF Document', size: '620 KB' }
    ],
    links: [
      { label: 'Enter Central Examination System', url: 'exam-taker' }
    ],
    contactInfo: {
      department: 'Chief Examination Directorate',
      email: 'examinations@bibu-edu.org',
      phone: '+1 (602) 845-9210'
    },
    authorizedSignatory: {
      name: 'Dr. Deborah K. Alvarez, D.Min.',
      title: 'Chief University Examiner',
      signatureText: 'Dr. D. K. Alvarez'
    },
    createdAt: '2026-08-18T10:30:00Z',
    createdBy: 'Dr. Deborah K. Alvarez',
    approvedBy: 'Rev. Dr. Sarah M. Jenkins',
    approvedAt: '2026-08-18T11:00:00Z',
    auditLogs: [
      { action: 'Created', user: 'Dr. Deborah K. Alvarez', timestamp: '2026-08-18 10:30 MST' },
      { action: 'Published', user: 'Dr. Deborah K. Alvarez', timestamp: '2026-08-18 11:00 MST' }
    ]
  },
  {
    id: 'bul-004',
    bulletinNumber: 'BIBU/BUL/2026/004',
    verificationCode: 'BIBU-VRF-2026-000004',
    title: 'BIBU Graduation Ceremony Announcement',
    subtitle: '28th Global Convocation & Conferral of Degrees — Phoenix Campus & Worldwide Broadcast',
    category: 'Graduation',
    department: "Chancellor's Executive Office",
    author: 'Dr. Michael C. Sterling, Th.D., D.Min.',
    authorRole: 'President & Chancellor',
    priority: 'Normal',
    targetAudience: 'Everyone',
    status: 'Published',
    publishDate: 'August 10, 2026',
    publishTime: '10:00 AM MST',
    year: 2026,
    isFeatured: true,
    viewsCount: 2240,
    downloadsCount: 710,
    featuredImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    summary:
      'The Chancellor and Academic Senate are pleased to announce the 28th Annual Global Graduation and Ordination Convocation. Over 850 graduating candidates from 42 countries will be awarded diplomas, bachelor, master, and doctorate credentials.',
    content: `
### 28TH ANNUAL CONVOCATION & DIPLOMA CONFERRAL

The President and Chancellor, Dr. Michael C. Sterling, on behalf of the Board of Trustees of Breakthrough International Bible University, warmly invites the international Christian community, faculty deans, alumni, graduating candidates, and their families to the **28th Global Graduation & Ordination Ceremony**.

#### 1. Convocation Theme & Keynote
* **Theme**: *"Equipped as Ambassadors of Reconciliation to the Nations"* (2 Corinthians 5:20)
* **Keynote Speaker**: Bishop Dr. Emmanuel Adeyemi, Global Missions Network, London
* **Chancellor’s Address & Charge to Graduates**: Dr. Michael C. Sterling

#### 2. Modes of Attendance
* **Physical Assembly**: Phoenix Central Auditorium, University Campus, Phoenix, Arizona, USA.
* **Global Interactive Stream**: Broadcast live in HD with simultaneous translation in French, Spanish, Portuguese, and Swahili.

#### 3. Graduation Clearance & Robe Orders
Graduating candidates must finalize their Academic Audit with the Registrar and settle outstanding Bursar fees before October 15, 2026, to receive their physical diploma regalia and cryptographic digital diploma credentials.
    `,
    importantDates: [
      { label: 'Graduation Clearance Deadline', date: 'October 15, 2026' },
      { label: 'Rehearsal & Baccalaureate Chapel', date: 'November 13, 2026' },
      { label: '28th Global Convocation Ceremony', date: 'November 14, 2026 • 10:00 AM MST' }
    ],
    instructions: [
      'Confirm attendance status (In-Person Phoenix or Online Live Convocation) in your portal.',
      'Order academic cap, hood, and gown from the official University Bookstore.',
      'Download your official digital invitation cards for distribution to your home congregation.'
    ],
    attachments: [
      { name: 'Graduation_Information_Packet_2026.pdf', type: 'PDF Document', size: '2.8 MB' },
      { name: 'Academic_Regalia_Order_Form.pdf', type: 'PDF Document', size: '890 KB' }
    ],
    links: [
      { label: 'Verify Degree Credentials', url: 'verification' },
      { label: 'Join Global Alumni Network', url: 'alumni' }
    ],
    contactInfo: {
      department: 'Convocation & Events Committee',
      email: 'graduation@bibu-edu.org',
      phone: '+1 (602) 845-9202'
    },
    authorizedSignatory: {
      name: 'Dr. Michael C. Sterling, Th.D.',
      title: 'President & Chancellor',
      signatureText: 'Dr. M. C. Sterling'
    },
    createdAt: '2026-08-10T09:15:00Z',
    createdBy: 'Dr. Michael C. Sterling',
    approvedBy: 'Dr. Michael C. Sterling',
    approvedAt: '2026-08-10T10:00:00Z',
    auditLogs: [
      { action: 'Created', user: 'Dr. Michael C. Sterling', timestamp: '2026-08-10 09:15 MST' },
      { action: 'Published', user: 'Dr. Michael C. Sterling', timestamp: '2026-08-10 10:00 MST' }
    ]
  },
  {
    id: 'bul-005',
    bulletinNumber: 'BIBU/BUL/2026/005',
    verificationCode: 'BIBU-VRF-2026-000005',
    title: 'Scholarship and Financial Assistance Opportunities',
    subtitle: 'Kingdom Bursary Grants, Frontier Missionary Sponsorships & Pastoral Tuition Reductions',
    category: 'Scholarships',
    department: 'University Financial Aid & Bursar',
    author: 'Rev. Kenneth Cole, MBA',
    authorRole: 'University Bursar',
    priority: 'Normal',
    targetAudience: 'Everyone',
    status: 'Published',
    publishDate: 'August 05, 2026',
    publishTime: '08:45 AM MST',
    year: 2026,
    isFeatured: false,
    viewsCount: 1650,
    downloadsCount: 512,
    featuredImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
    summary:
      'Breakthrough International Bible University announces the disbursement of over $150,000 in dedicated Kingdom Scholarship Funds to support pastors in frontier regions, church planters, and international theological candidates.',
    content: `
### 2026/2027 KINGDOM SCHOLARSHIP AND TUITION RELIEF FUNDS

Through the benevolence of the BIBU Endowment Trust and our global partners, the University Financial Aid Committee has allocated dedicated scholarship funds for the 2026/2027 academic session.

#### 1. Available Scholarship Categories
* **Frontier Missions Grant**: 50% tuition reduction for active cross-cultural missionaries serving in 10/40 window nations.
* **Pastoral Shepherding Fellowship**: Up to 40% relief for senior pastors of congregations with fewer than 150 members.
* **Women in Ministry Leadership Grant**: Full and partial support for women pursuing master-level theological and counseling degrees.
* **Academic Excellence Award**: Granted to returning students who maintain a cumulative GPA of 3.85 or higher.

#### 2. Eligibility Requirements
Applicants must demonstrate active involvement in local church ministry, maintain academic standing, and submit an ecclesiastical recommendation letter.
    `,
    importantDates: [
      { label: 'Scholarship Application Window Opens', date: 'August 01, 2026' },
      { label: 'Application Submission Cut-Off', date: 'September 20, 2026' },
      { label: 'Award Notifications Sent', date: 'September 30, 2026' }
    ],
    instructions: [
      'Complete the standard Online Admissions Application first.',
      'Fill out the Scholarship Application Form with financial statement.',
      'Upload a pastoral endorsement detailing your ministerial field of service.'
    ],
    attachments: [
      { name: 'Kingdom_Scholarship_Application_Form.pdf', type: 'PDF Document', size: '920 KB' },
      { name: 'Financial_Aid_Policies_2026.pdf', type: 'PDF Document', size: '540 KB' }
    ],
    links: [
      { label: 'View Student Tuition Portal', url: 'finance' }
    ],
    contactInfo: {
      department: 'University Financial Aid Committee',
      email: 'finaid@bibu-edu.org',
      phone: '+1 (602) 845-9215'
    },
    authorizedSignatory: {
      name: 'Rev. Kenneth Cole, MBA',
      title: 'University Bursar',
      signatureText: 'Rev. K. Cole'
    },
    createdAt: '2026-08-05T08:00:00Z',
    createdBy: 'Rev. Kenneth Cole',
    approvedBy: 'Rev. Dr. Sarah M. Jenkins',
    approvedAt: '2026-08-05T08:45:00Z',
    auditLogs: [
      { action: 'Created', user: 'Rev. Kenneth Cole', timestamp: '2026-08-05 08:00 MST' },
      { action: 'Published', user: 'Rev. Kenneth Cole', timestamp: '2026-08-05 08:45 MST' }
    ]
  },
  {
    id: 'bul-006',
    bulletinNumber: 'BIBU/BUL/2026/006',
    verificationCode: 'BIBU-VRF-2026-000006',
    title: 'Faculty Academic Development Seminar',
    subtitle: 'Theological Pedagogy, Online LMS Instructional Design & Research Publication Standards',
    category: 'Faculty & Staff',
    department: 'Academic Senate & Deans Council',
    author: 'Prof. Jonathan Vance, Th.D.',
    authorRole: 'Dean of Academic Affairs',
    priority: 'Important',
    targetAudience: 'Faculty',
    status: 'Published',
    publishDate: 'July 28, 2026',
    publishTime: '02:00 PM MST',
    year: 2026,
    isFeatured: false,
    viewsCount: 540,
    downloadsCount: 180,
    featuredImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    summary:
      'All appointed faculty members, adjunct lecturers, course authors, and doctoral thesis advisors are scheduled to attend the biannual Faculty Development Colloquium focused on advanced digital pedagogy and hermeneutic rubric design.',
    content: `
### FACULTY & INSTRUCTOR COLLOQUIUM 2026

The Deans Council cordially convenes all full-time and adjunct faculty members across our 9 academic faculties for the **Biannual Faculty Development Workshop**.

#### 1. Workshop Core Modules
* **Unit 1**: Interactive Asynchronous Teaching & Video Lecture Delivery
* **Unit 2**: Constructing Multi-Dimensional Grading Rubrics in the BIBU LMS
* **Unit 3**: Hermeneutic Moderation & Preventing AI-Assisted Plagiarism
* **Unit 4**: Supervising Graduate Dissertations & D.Min. Project Portfolios

#### 2. Faculty Resource Kits
Instructors will receive updated course syllabus templates, scripture cross-referencing guides, and digital lecture recording toolkits.
    `,
    importantDates: [
      { label: 'Colloquium Opening Session', date: 'September 08, 2026 • 09:00 AM MST' },
      { label: 'Curriculum Submission Deadline', date: 'September 18, 2026' }
    ],
    instructions: [
      'RSVP via the Faculty Command Center portal.',
      'Submit your updated Fall syllabus draft for review.',
      'Verify your course exam question banks are updated.'
    ],
    attachments: [
      { name: 'Faculty_Development_Agenda_2026.pdf', type: 'PDF Document', size: '1.1 MB' },
      { name: 'LMS_Instructor_Handbook.pdf', type: 'PDF Document', size: '2.3 MB' }
    ],
    links: [
      { label: 'Access Faculty & Instructor Portal', url: 'faculty-portal' }
    ],
    contactInfo: {
      department: 'Office of Faculty Development',
      email: 'faculty@bibu-edu.org',
      phone: '+1 (602) 845-9220'
    },
    authorizedSignatory: {
      name: 'Prof. Jonathan Vance, Th.D.',
      title: 'Dean of Academic Affairs',
      signatureText: 'Prof. J. Vance'
    },
    createdAt: '2026-07-28T13:30:00Z',
    createdBy: 'Prof. Jonathan Vance',
    approvedBy: 'Dr. Michael C. Sterling',
    approvedAt: '2026-07-28T14:00:00Z',
    auditLogs: [
      { action: 'Created', user: 'Prof. Jonathan Vance', timestamp: '2026-07-28 13:30 MST' },
      { action: 'Published', user: 'Prof. Jonathan Vance', timestamp: '2026-07-28 14:00 MST' }
    ]
  },
  {
    id: 'bul-007',
    bulletinNumber: 'BIBU/BUL/2026/007',
    verificationCode: 'BIBU-VRF-2026-000007',
    title: 'Global Ministry and Christian Leadership Conference',
    subtitle: 'Connecting 14,500+ Ordained Ministers, Church Planters & Missionaries Worldwide',
    category: 'Ministry & Christian Leadership',
    department: 'Global Ministerial Network & Missions',
    author: 'Bishop Dr. Emmanuel Adeyemi, D.Min.',
    authorRole: 'Director of Global Ministerial Fellowships',
    priority: 'Normal',
    targetAudience: 'Everyone',
    status: 'Published',
    publishDate: 'July 15, 2026',
    publishTime: '01:15 PM MST',
    year: 2026,
    isFeatured: true,
    viewsCount: 2980,
    downloadsCount: 940,
    featuredImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    summary:
      'Join thousands of pastors, evangelists, church planters, and Christian leaders across 64 countries for the 2026 Global Ministry Leadership Summit featuring keynote apostolic sessions, ministry breakout tracks, and global prayer vigils.',
    content: `
### 2026 GLOBAL MINISTERIAL SUMMIT & APOSTOLIC ALLIANCE

The Directorate of Global Ministerial Fellowships and Alumni Relations cordially announces the **2026 Global Ministry and Christian Leadership Summit**.

#### 1. Summit Focus & Highlights
* **Strategic Church Multiplication**: Equipping pastors with scalable, Spirit-empowered models for urban and rural church planting.
* **Frontier Evangelism & Unreached Clusters**: Missiological reports from frontline missionaries in South Asia, East Africa, and Latin America.
* **Pastoral Health & Burnout Prevention**: Practical mental, emotional, and spiritual renewal for ministry shepherds and their spouses.
* **Kingdom Marketplace Leadership**: Integrating biblical ethics, entrepreneurship, and public diplomacy.

#### 2. Specialized Ministry Breakouts
Participants can join roundtables in Pastoral Leadership, Youth & Children Ministry, Christian Counseling & Chaplaincy, and Digital Church Media.
    `,
    importantDates: [
      { label: 'Early-Bird Online Registration', date: 'August 30, 2026' },
      { label: 'Summit Opening Keynote Broadcast', date: 'October 28, 2026 • 09:00 AM MST' },
      { label: 'Global 24-Hour Prayer Chain', date: 'October 30, 2026' }
    ],
    instructions: [
      'Register your delegation through the Global Fellowships portal.',
      'Select your 2 preferred ministry breakout tracks.',
      'Submit prayer requests and regional ministry reports for the Summit Booklet.'
    ],
    eventDetails: {
      title: '2026 Global Ministry Leadership Summit',
      date: 'October 28–30, 2026',
      time: '09:00 AM - 05:00 PM MST Daily',
      location: 'Phoenix Central Conference Arena & Global Virtual Simulcast',
      isOnline: true,
      organizer: 'BIBU Global Ministerial Network',
      registrationUrl: 'fellowships',
      contactEmail: 'summit@bibu-edu.org',
      contactPhone: '+1 (602) 845-9230'
    },
    attachments: [
      { name: 'Global_Ministry_Summit_Brochure_2026.pdf', type: 'PDF Document', size: '3.1 MB' },
      { name: 'Ministerial_Breakout_Sessions_Guide.pdf', type: 'PDF Document', size: '1.4 MB' }
    ],
    links: [
      { label: 'Explore Global Ministry Fellowships', url: 'fellowships' },
      { label: 'Connect with Global Alumni Directory', url: 'alumni' }
    ],
    contactInfo: {
      department: 'Global Ministerial Network Directorate',
      email: 'fellowships@bibu-edu.org',
      phone: '+1 (602) 845-9230'
    },
    authorizedSignatory: {
      name: 'Bishop Dr. Emmanuel Adeyemi, D.Min.',
      title: 'Director of Global Ministerial Fellowships',
      signatureText: 'Dr. E. Adeyemi'
    },
    createdAt: '2026-07-15T12:00:00Z',
    createdBy: 'Bishop Dr. Emmanuel Adeyemi',
    approvedBy: 'Dr. Michael C. Sterling',
    approvedAt: '2026-07-15T13:15:00Z',
    auditLogs: [
      { action: 'Created', user: 'Bishop Dr. Emmanuel Adeyemi', timestamp: '2026-07-15 12:00 MST' },
      { action: 'Published', user: 'Bishop Dr. Emmanuel Adeyemi', timestamp: '2026-07-15 13:15 MST' }
    ]
  },
  {
    id: 'bul-008',
    bulletinNumber: 'BIBU/BUL/2026/008',
    verificationCode: 'BIBU-VRF-2026-000008',
    title: 'Theological Research Colloquium & Postgraduate Defenses',
    subtitle: 'Fall 2026 Doctoral Dissertations & Master Theses Presentations',
    category: 'Research & Publications',
    department: 'Postgraduate Research Directorate',
    author: 'Dr. Thomas E. Wright, Ph.D.',
    authorRole: 'Director of Postgraduate Theological Research',
    priority: 'Normal',
    targetAudience: 'Postgraduate Students',
    status: 'Published',
    publishDate: 'July 02, 2026',
    publishTime: '10:00 AM MST',
    year: 2026,
    isFeatured: false,
    viewsCount: 780,
    downloadsCount: 290,
    featuredImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
    summary:
      'The Postgraduate Research Directorate announces public oral defenses for candidates completing Doctor of Ministry (D.Min), Doctor of Theology (Th.D.), and Ph.D. in Biblical Studies dissertations.',
    content: `
### POSTGRADUATE THEOLOGICAL RESEARCH COLLOQUIUM

The Directorate of Research & Publications invites scholars, faculty members, and research candidates to the **Fall 2026 Dissertation Defense Colloquium**.

#### 1. Featured Dissertation Topics
* *A Grammatical and Historical Analysis of Pauline Pneumatology in the Pastoral Epistles* — Candidate: Rev. Marcus Vance
* *Indigenous Missiological Strategies for Urban Church Planting in Francophone Africa* — Candidate: Pastor Jean-Luc Kaboré
* *The Biblical Integration of Crisis Counseling in Post-Disaster Pastoral Care* — Candidate: Minister Ruth O'Connor
    `,
    importantDates: [
      { label: 'Final Dissertation Submission', date: 'September 15, 2026' },
      { label: 'Public Oral Defense Days', date: 'October 20–22, 2026' }
    ],
    attachments: [
      { name: 'Research_Colloquium_Schedule_2026.pdf', type: 'PDF Document', size: '1.2 MB' }
    ],
    contactInfo: {
      department: 'Postgraduate Research Directorate',
      email: 'research@bibu-edu.org',
      phone: '+1 (602) 845-9225'
    },
    authorizedSignatory: {
      name: 'Dr. Thomas E. Wright, Ph.D.',
      title: 'Director of Postgraduate Research',
      signatureText: 'Dr. T. E. Wright'
    },
    createdAt: '2026-07-02T09:00:00Z',
    createdBy: 'Dr. Thomas E. Wright',
    approvedBy: 'Rev. Dr. Sarah M. Jenkins',
    approvedAt: '2026-07-02T10:00:00Z',
    auditLogs: [
      { action: 'Created', user: 'Dr. Thomas E. Wright', timestamp: '2026-07-02 09:00 MST' },
      { action: 'Published', user: 'Rev. Dr. Sarah M. Jenkins', timestamp: '2026-07-02 10:00 MST' }
    ]
  },
  {
    id: 'bul-009',
    bulletinNumber: 'BIBU/BUL/2026/009',
    verificationCode: 'BIBU-VRF-2026-000009',
    title: 'Emergency LMS Platform Optimization & Scheduled Server Maintenance',
    subtitle: 'System Upgrade Notice for Global Classroom & Examination Servers',
    category: 'Emergency Notices',
    department: "Registrar's Office",
    author: 'Systems Administration Directorate',
    authorRole: 'Chief Technology Officer',
    priority: 'Critical',
    targetAudience: 'Everyone',
    status: 'Published',
    publishDate: 'August 24, 2026',
    publishTime: '06:00 AM MST',
    year: 2026,
    isFeatured: false,
    viewsCount: 3100,
    downloadsCount: 120,
    summary:
      'Notice of scheduled 2-hour cloud server optimization on Sunday, August 30, 2026, from 01:00 AM to 03:00 AM MST. Virtual classrooms and timed exam sessions will be paused during this brief maintenance window.',
    content: `
### URGENT NOTICE: SCHEDULED PLATFORM MAINTENANCE

The IT Directorate and Registrar announce a scheduled server optimization to increase international bandwidth and database synchronization for our 3,800+ online students across 64 nations.

* **Maintenance Window**: Sunday, August 30, 2026, 01:00 AM – 03:00 AM MST (08:00 – 10:00 GMT)
* **Affected Services**: Online Classroom submissions, Timed Examination Rooms, and Certificate Instant Verification.
* **Recommendations**: Students are advised to submit active assignment papers and save reflection notes prior to the maintenance window.
    `,
    importantDates: [
      { label: 'Scheduled Maintenance Window', date: 'Sunday, August 30, 2026 • 01:00–03:00 AM MST' },
      { label: 'Normal Operations Resume', date: 'Sunday, August 30, 2026 • 03:15 AM MST' }
    ],
    contactInfo: {
      department: 'IT & LMS Systems Support',
      email: 'support@bibu-edu.org',
      phone: '+1 (602) 845-9299'
    },
    authorizedSignatory: {
      name: 'Rev. Dr. Sarah M. Jenkins, Th.D.',
      title: 'University Registrar',
      signatureText: 'S. M. Jenkins, Th.D.'
    },
    createdAt: '2026-08-24T05:30:00Z',
    createdBy: 'IT Systems Admin',
    approvedBy: 'Rev. Dr. Sarah M. Jenkins',
    approvedAt: '2026-08-24T06:00:00Z',
    auditLogs: [
      { action: 'Created', user: 'IT Systems Admin', timestamp: '2026-08-24 05:30 MST' },
      { action: 'Published', user: 'Rev. Dr. Sarah M. Jenkins', timestamp: '2026-08-24 06:00 MST' }
    ]
  }
];
