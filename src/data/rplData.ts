import { RPLApplicationRecord, RPLProgramRule } from '../types/rpl';

export const RPL_MINISTRY_ROLES: string[] = [
  'Senior Pastor',
  'Associate Pastor',
  'Lead Pastor',
  'Assistant Pastor',
  'Evangelist',
  'Global Missionary',
  'Church Planter',
  'Bishop / Presiding Overseer',
  'Ordained Minister',
  'Hospital Chaplain',
  'Military / Prison Chaplain',
  'Youth & Young Adult Pastor',
  'Children & Family Minister',
  'Worship & Music Minister',
  'Christian Educator / Bible Teacher',
  'Discipleship Director',
  'Christian Counselor / Pastoral Care',
  'Church Administrator / Executive Director',
  'Denominational / Diocesan Leader',
  'Christian NGO / Relief Leader',
  'Theological Instructor / Seminary Tutor',
  'Community Outreach Minister',
  'Digital Media & Broadcasting Minister',
  'Women’s Ministry Director',
  'Men’s Fellowship Director'
];

export const RPL_EXPERIENCE_DOMAINS: { id: string; name: string; description: string; mappedCourses: string[] }[] = [
  {
    id: 'homiletics_preaching',
    name: 'Expository Preaching & Biblical Hermeneutics',
    description: 'Systematic pulpit preaching, sermon preparation, scripture exegesis, context hermeneutics, and homiletic delivery.',
    mappedCourses: ['MIN-201', 'THEO-301', 'BIB-101']
  },
  {
    id: 'pastoral_care',
    name: 'Pastoral Theology & Shepherding Care',
    description: 'Pastoral counseling, crisis intervention, bereavement ministry, hospital visitation, premarital guidance, and spiritual direction.',
    mappedCourses: ['MIN-302', 'COUN-201', 'THEO-202']
  },
  {
    id: 'church_planting',
    name: 'Church Planting & Pioneering Ministry',
    description: 'Establishing new apostolic congregations, local community mobilization, discipleship development, and leadership succession.',
    mappedCourses: ['MISS-301', 'LEAD-401', 'MIN-101']
  },
  {
    id: 'missions_evangelism',
    name: 'Global Missions & Cross-Cultural Evangelism',
    description: 'Cross-cultural field missions, public crusades, open-air evangelism, missionary church planting, and unreached peoples outreach.',
    mappedCourses: ['MISS-201', 'THEO-102', 'MISS-401']
  },
  {
    id: 'christian_leadership',
    name: 'Christian Leadership & Church Administration',
    description: 'Board governance, ministry financial stewardship, volunteer management, conflict resolution, and structural policy drafting.',
    mappedCourses: ['LEAD-301', 'ADM-201', 'LEAD-402']
  },
  {
    id: 'discipleship_education',
    name: 'Christian Education & Discipleship Systems',
    description: 'Bible institute instruction, catechism curricula, small group discipleship frameworks, and Sunday school leadership.',
    mappedCourses: ['EDU-201', 'BIB-202', 'MIN-203']
  }
];

export const INITIAL_RPL_PROGRAM_RULES: RPLProgramRule[] = [
  {
    programId: 'prog-bth-01',
    programName: 'Bachelor of Theology (B.Th)',
    academicLevel: 'Bachelor',
    totalProgramCredits: 120,
    maxRPLPercentage: 35, // 35% of 120 credits = 42 credits
    maxRPLCredits: 42,
    residencyCreditsRequired: 78,
    baseApplicationFeeUSD: 100,
    perCreditAssessmentFeeUSD: 15,
    eligibleCourses: [
      {
        courseId: 'crs-herm-301',
        courseCode: 'THEO-301',
        courseTitle: 'Biblical Hermeneutics & Exegesis',
        creditHours: 3,
        recommendedMinistryYears: 3,
        primaryEvidenceTypes: ['Sermon Outlines & Teaching Manuscripts', 'Bible Study & Discipleship Materials'],
        assessmentMethod: 'Portfolio assessment'
      },
      {
        courseId: 'crs-hom-201',
        courseCode: 'MIN-201',
        courseTitle: 'Principles of Homiletics & Sermon Preparation',
        creditHours: 3,
        recommendedMinistryYears: 4,
        primaryEvidenceTypes: ['Sermon Outlines & Teaching Manuscripts', 'Ministry Photographs & Media'],
        assessmentMethod: 'Sermon evaluation'
      },
      {
        courseId: 'crs-lead-301',
        courseCode: 'LEAD-301',
        courseTitle: 'Pastoral Leadership & Church Governance',
        creditHours: 3,
        recommendedMinistryYears: 5,
        primaryEvidenceTypes: ['Leadership Appointments', 'Church Administration & Policy Documents'],
        assessmentMethod: 'Structured interview'
      },
      {
        courseId: 'crs-miss-201',
        courseCode: 'MISS-201',
        courseTitle: 'Introduction to Global Evangelism & Church Planting',
        creditHours: 3,
        recommendedMinistryYears: 3,
        primaryEvidenceTypes: ['Mission & Evangelism Reports', 'Ministry Ordination & Licenses'],
        assessmentMethod: 'Portfolio assessment'
      },
      {
        courseId: 'crs-coun-201',
        courseCode: 'COUN-201',
        courseTitle: 'Biblical Counseling & Pastoral Care',
        creditHours: 3,
        recommendedMinistryYears: 4,
        primaryEvidenceTypes: ['Anonymized Pastoral Care Records', 'Third-Party References & Letters'],
        assessmentMethod: 'Structured interview'
      }
    ]
  },
  {
    programId: 'prog-mdiv-01',
    programName: 'Master of Divinity (M.Div)',
    academicLevel: 'Master',
    totalProgramCredits: 90,
    maxRPLPercentage: 30, // 30% of 90 = 27 credits
    maxRPLCredits: 27,
    residencyCreditsRequired: 63,
    baseApplicationFeeUSD: 150,
    perCreditAssessmentFeeUSD: 20,
    eligibleCourses: [
      {
        courseId: 'crs-mdiv-advpastoral',
        courseCode: 'THEO-501',
        courseTitle: 'Advanced Pastoral Ministry & Ecclesiology',
        creditHours: 4,
        recommendedMinistryYears: 7,
        primaryEvidenceTypes: ['Ministry Ordination & Licenses', 'Church Administration & Policy Documents'],
        assessmentMethod: 'Portfolio assessment'
      },
      {
        courseId: 'crs-mdiv-advhomiletics',
        courseCode: 'MIN-502',
        courseTitle: 'Advanced Expository Homiletics',
        creditHours: 4,
        recommendedMinistryYears: 6,
        primaryEvidenceTypes: ['Sermon Outlines & Teaching Manuscripts', 'Publications & Training Manuals'],
        assessmentMethod: 'Sermon evaluation'
      },
      {
        courseId: 'crs-mdiv-missions',
        courseCode: 'MISS-501',
        courseTitle: 'Apostolic Church Planting & Cross-Cultural Strategy',
        creditHours: 4,
        recommendedMinistryYears: 5,
        primaryEvidenceTypes: ['Mission & Evangelism Reports', 'Third-Party References & Letters'],
        assessmentMethod: 'Case study'
      }
    ]
  },
  {
    programId: 'prog-dmin-01',
    programName: 'Doctor of Ministry (D.Min) in Apostolic Leadership',
    academicLevel: 'Doctorate',
    totalProgramCredits: 60,
    maxRPLPercentage: 25, // 25% of 60 = 15 credits
    maxRPLCredits: 15,
    residencyCreditsRequired: 45,
    baseApplicationFeeUSD: 200,
    perCreditAssessmentFeeUSD: 30,
    eligibleCourses: [
      {
        courseId: 'crs-dmin-strategic',
        courseCode: 'LEAD-701',
        courseTitle: 'Strategic Ecclesial Leadership & Organizational Development',
        creditHours: 5,
        recommendedMinistryYears: 10,
        primaryEvidenceTypes: ['Publications & Training Manuals', 'Church Administration & Policy Documents'],
        assessmentMethod: 'Reflective essay'
      },
      {
        courseId: 'crs-dmin-appliedtheol',
        courseCode: 'THEO-702',
        courseTitle: 'Applied Theological Praxis & Ministry Research Formulation',
        creditHours: 5,
        recommendedMinistryYears: 10,
        primaryEvidenceTypes: ['Publications & Training Manuals', 'Sermon Outlines & Teaching Manuscripts'],
        assessmentMethod: 'Portfolio assessment'
      }
    ]
  },
  {
    programId: 'prog-dip-01',
    programName: 'Diploma in Christian Ministry (Dip.C.M)',
    academicLevel: 'Diploma',
    totalProgramCredits: 60,
    maxRPLPercentage: 45, // 45% of 60 = 27 credits
    maxRPLCredits: 27,
    residencyCreditsRequired: 33,
    baseApplicationFeeUSD: 75,
    perCreditAssessmentFeeUSD: 10,
    eligibleCourses: [
      {
        courseId: 'crs-dip-foundations',
        courseCode: 'MIN-101',
        courseTitle: 'Foundations of Practical Christian Ministry',
        creditHours: 3,
        recommendedMinistryYears: 2,
        primaryEvidenceTypes: ['Ministry Ordination & Licenses', 'Ministry Photographs & Media'],
        assessmentMethod: 'Portfolio assessment'
      },
      {
        courseId: 'crs-dip-evang',
        courseCode: 'MISS-101',
        courseTitle: 'Local Outreach & Personal Evangelism',
        creditHours: 3,
        recommendedMinistryYears: 2,
        primaryEvidenceTypes: ['Mission & Evangelism Reports'],
        assessmentMethod: 'Portfolio assessment'
      }
    ]
  }
];

export const INITIAL_RPL_APPLICATIONS: RPLApplicationRecord[] = [
  {
    id: 'rpl-app-001',
    applicationNumber: 'BIBU-RPL-2026-000101',
    verificationCode: 'VRPL-78921-AZ',
    studentId: 'BIBU-STU-2026-1049',
    userId: 'usr-student-01',
    applicantName: 'David K. Maina',
    email: 'student@bibu.edu',
    phone: '+1 (602) 555-0144',
    country: 'Kenya',
    nationality: 'Kenyan',
    dateOfBirth: '1984-06-14',
    churchAffiliation: 'Grace Harvest International Fellowship, Nairobi',
    currentRole: 'Senior Pastor',
    yearsInMinistry: 12,
    highestAcademicLevel: 'Diploma in Religious Education',
    desiredProgramId: 'prog-bth-01',
    desiredProgramName: 'Bachelor of Theology (B.Th)',
    schoolId: 'sch-theology',
    ministryPositions: [
      {
        id: 'pos-1',
        organization: 'Grace Harvest International Fellowship',
        positionTitle: 'Senior Pastor & Church Planter',
        startDate: '2014-01-01',
        endDate: 'Present',
        isCurrent: true,
        country: 'Kenya',
        cityLocation: 'Nairobi & Machakos',
        responsibilities: 'Overall preaching, pastoral leadership, oversight of 450-member congregation, supervision of 8 department leaders.',
        peopleServed: '450+ Active Parishioners',
        leadershipScope: 'Senior Apostolic Leadership, Board Chairman',
        teachingHoursWeekly: 8,
        pastoralDuties: 'Weekly expository sermon delivery, pastoral counseling, weddings, baptisms, elder ordination.',
        achievements: 'Planted 2 branch congregations in eastern region, established weekly food bank and youth apprenticeship academy.'
      },
      {
        id: 'pos-2',
        organization: 'East Africa Gospel Outreach',
        positionTitle: 'Evangelism Coordinator & Itinerant Preacher',
        startDate: '2010-03-01',
        endDate: '2013-12-31',
        isCurrent: false,
        country: 'Kenya & Uganda',
        cityLocation: 'Regional Rift Valley',
        responsibilities: 'Led inter-denominational rural evangelism campaigns and literature distribution.',
        peopleServed: 'Thousands reached at open-air rallies',
        leadershipScope: 'Crusade Director',
        pastoralDuties: 'New convert follow-up and discipleship literature distribution.',
        achievements: 'Conducted 24 rural outreach missions and trained over 120 church volunteer soul-winners.'
      }
    ],
    competencies: [
      {
        id: 'comp-1',
        learningOutcome: 'Demonstrate rigorous expository sermon design and biblical hermeneutics.',
        courseCode: 'THEO-301',
        courseTitle: 'Biblical Hermeneutics & Exegesis',
        creditValue: 3,
        selfRating: 5,
        demonstrationMethod: '12 years of weekly expository sermon preparation and Greek/Hebrew study notes.',
        applicantNarrative: 'I prepare 52 weekly manuscript messages analyzing original historical contexts, syntax, and pastoral applications.',
        assessorDecision: 'Credit Awarded',
        awardedCredits: 3,
        assessorNotes: 'Extensive portfolio with high hermeneutical fidelity and contextual depth.'
      },
      {
        id: 'comp-2',
        learningOutcome: 'Articulate biblical principles of pastoral shepherding, counseling ethics, and crisis care.',
        courseCode: 'COUN-201',
        courseTitle: 'Biblical Counseling & Pastoral Care',
        creditValue: 3,
        selfRating: 4,
        demonstrationMethod: 'Anonymized pastoral logs and crisis intervention case records.',
        applicantNarrative: 'Conducted over 300 counseling sessions covering grief, marriage reconciliation, and youth guidance under strict pastoral confidentiality.',
        assessorDecision: 'Credit Awarded',
        awardedCredits: 3,
        assessorNotes: 'Clear understanding of pastoral boundaries and biblical counseling methods.'
      },
      {
        id: 'comp-3',
        learningOutcome: 'Formulate apostolic church governance structures and financial stewardship frameworks.',
        courseCode: 'LEAD-301',
        courseTitle: 'Pastoral Leadership & Church Governance',
        creditValue: 3,
        selfRating: 5,
        demonstrationMethod: 'Church constitution, deacon bylaws, and audited financial statements.',
        applicantNarrative: 'Drafted full operational constitution for Grace Harvest Church including financial transparency standards and elder governance bylaws.',
        assessorDecision: 'Credit Awarded',
        awardedCredits: 3,
        assessorNotes: 'Exemplary administrative governance portfolio.'
      },
      {
        id: 'comp-4',
        learningOutcome: 'Design and execute cross-cultural evangelism initiatives and disciple multiplication.',
        courseCode: 'MISS-201',
        courseTitle: 'Introduction to Global Evangelism & Church Planting',
        creditValue: 3,
        selfRating: 4,
        demonstrationMethod: 'Field reports and branch church records.',
        applicantNarrative: 'Pioneered two self-sustaining rural congregations and trained church planting teams.',
        assessorDecision: 'Credit Awarded',
        awardedCredits: 3,
        assessorNotes: 'Verified church planting trajectory and fruitfulness.'
      }
    ],
    evidenceList: [
      {
        id: 'ev-1',
        title: 'Official Ministerial Ordination Certificate',
        classification: 'Direct Evidence',
        type: 'Ministry Ordination & Licenses',
        description: 'Issued by Evangelical Alliance of Kenya (Ordination Presbytery).',
        fileName: 'david_maina_ordination_credential.pdf',
        fileSize: '2.4 MB',
        issuingOrganization: 'Evangelical Alliance Presbytery',
        dateIssued: '2014-04-12',
        verificationStatus: 'Verified',
        assessorComments: 'Authentic certificate with registrar seal verified.',
        score: 95
      },
      {
        id: 'ev-2',
        title: '3-Year Expository Sermon Archive (Romans & Ephesians)',
        classification: 'Documentary Evidence',
        type: 'Sermon Outlines & Teaching Manuscripts',
        description: 'Bound volume of 48 expository sermon manuscripts with Greek study notes and congregational outlines.',
        fileName: 'ephesians_romans_sermons_vol1.pdf',
        fileSize: '8.1 MB',
        issuingOrganization: 'Grace Harvest Pulpit',
        dateIssued: '2023-11-20',
        verificationStatus: 'Verified',
        assessorComments: 'High theological competence and sound hermeneutical application.',
        score: 92
      },
      {
        id: 'ev-3',
        title: 'Grace Harvest Church Constitution & Governance Charter',
        classification: 'Documentary Evidence',
        type: 'Church Administration & Policy Documents',
        description: 'Official bylaws, elder handbook, and financial accountability policies authored by candidate.',
        fileName: 'church_constitution_bylaws.pdf',
        fileSize: '1.9 MB',
        issuingOrganization: 'Grace Harvest Board of Trustees',
        dateIssued: '2017-08-15',
        verificationStatus: 'Verified',
        assessorComments: 'Demonstrates professional leadership and institutional governance.',
        score: 90
      }
    ],
    reflectiveStatements: {
      callingAndPhilosophy: 'My ministerial calling began eighteen years ago with a burden for theological grounding in the local church. I believe that sound doctrine must express itself in compassionate community transformation.',
      biblicalTheologicalGrowth: 'Through continuous pastoral preaching, I have developed a deep reverence for the historical-grammatical interpretation of scripture, ensuring that Christ remains the central focus of all proclamation.',
      pastoralLeadershipImpact: 'Leadership is servanthood. By empowering lay elders and mentoring young ministers, we transitioned from a single congregation into a multiplying fellowship with two daughter churches.',
      crossCulturalMissions: 'Reaching beyond our comfort zone, we have conducted annual missionary outreaches to remote semi-arid counties, training indigenous pastors with basic discipleship tools.'
    },
    references: [
      {
        id: 'ref-1',
        name: 'Bishop Arthur K. Mwangi',
        roleTitle: 'Presiding Bishop',
        organization: 'Nairobi Christian Ministries Council',
        email: 'bishop.arthur@ncmc.org',
        phone: '+254 722 000 111',
        relationshipYears: 14,
        referenceLetterStatus: 'Received',
        referenceNotes: 'Highly commended for integrity, pulpit eloquence, and faithful biblical shepherding.'
      },
      {
        id: 'ref-2',
        name: 'Rev. Dr. Samuel Otieno',
        roleTitle: 'Regional Superintendent',
        organization: 'Evangelical Fellowship of Africa',
        email: 's.otieno@efa-regional.org',
        phone: '+254 733 999 888',
        relationshipYears: 10,
        referenceLetterStatus: 'Received',
        referenceNotes: 'Strong endorsement for prior learning assessment in theology and leadership.'
      }
    ],
    declarationConfirmed: true,
    digitalSignature: 'David K. Maina (Electronic Affirmation)',
    submissionDate: '2026-02-10',
    requestedCredits: 24,
    potentialCreditsEstimated: 24,
    approvedCredits: 12,
    feeAmountUSD: 280, // $100 base + (12 * $15)
    feeStatus: 'Paid',
    paymentReceiptNumber: 'BIBU-PAY-RPL-9921',
    status: 'Credit Approved',
    progressPercentage: 100,
    assessorName: 'Prof. John Mark Abernathy, Ph.D.',
    assessorId: 'fac-001',
    assessorConflictDeclared: true,
    assessmentMethodsUsed: ['Portfolio assessment', 'Structured interview', 'Sermon evaluation'],
    assessorNotes: 'The candidate demonstrated advanced practical mastery across homiletics, pastoral care, and church governance. 12 academic credits awarded toward the Bachelor of Theology program.',
    assessmentDate: '2026-02-18',
    interviewScheduledDate: '2026-02-16',
    interviewNotes: 'Interview conducted via secure video conference. Candidate defended his theological framework and homiletic method convincingly.',
    interviewResult: 'Passed',
    moderatorName: 'Dr. Elizabeth Warren, Academic Dean',
    moderationNotes: 'Full compliance with BIBU Academic Credit for Ministry Experience policies. Credit transcript update authorized.',
    academicDeanApprovalDate: '2026-02-20',
    transcriptEntryConfirmed: true,
    appeals: [],
    auditLogs: [
      {
        id: 'log-1',
        timestamp: '2026-02-10 09:14:00',
        actorName: 'David K. Maina',
        actorRole: 'Applicant',
        action: 'Application Submitted',
        notes: 'Submitted initial portfolio with 3 evidence documents and 4 competency mappings.'
      },
      {
        id: 'log-2',
        timestamp: '2026-02-12 14:30:00',
        actorName: 'RPL Academic Registrar',
        actorRole: 'Registrar',
        action: 'Verification Complete',
        notes: 'Administrative verification of identity, credentials, and payment receipt confirmed.'
      },
      {
        id: 'log-3',
        timestamp: '2026-02-18 16:00:00',
        actorName: 'Prof. John Mark Abernathy',
        actorRole: 'Assessor',
        action: 'Assessment Finalized',
        notes: 'Approved 12 academic credits across THEO-301, COUN-201, LEAD-301, and MISS-201.'
      },
      {
        id: 'log-4',
        timestamp: '2026-02-20 11:20:00',
        actorName: 'Dr. Elizabeth Warren',
        actorRole: 'Academic Dean',
        action: 'Credit Decision Ratified',
        notes: 'Final credit conferral approved. Recorded to student SIS record.'
      }
    ]
  },
  {
    id: 'rpl-app-002',
    applicationNumber: 'BIBU-RPL-2026-000102',
    verificationCode: 'VRPL-33104-AZ',
    studentId: 'BIBU-STU-2026-1088',
    applicantName: 'Grace N. Adebayo',
    email: 'grace.adebayo@faithmission.org',
    phone: '+234 803 123 4567',
    country: 'Nigeria',
    nationality: 'Nigerian',
    dateOfBirth: '1979-11-28',
    churchAffiliation: 'Redeemed Apostolic Mission, Lagos',
    currentRole: 'Senior Pastor & Mission Director',
    yearsInMinistry: 16,
    highestAcademicLevel: 'Bachelor of Arts in English',
    desiredProgramId: 'prog-mdiv-01',
    desiredProgramName: 'Master of Divinity (M.Div)',
    schoolId: 'sch-theology',
    ministryPositions: [
      {
        id: 'pos-201',
        organization: 'Redeemed Apostolic Mission',
        positionTitle: 'Senior Pastor & West Africa Missions Director',
        startDate: '2008-05-01',
        endDate: 'Present',
        isCurrent: true,
        country: 'Nigeria',
        cityLocation: 'Lagos & Cotonou',
        responsibilities: 'Pastoral shepherding, training of 30 church workers, mission planting across Benin & Togo border.',
        peopleServed: '600+ Members',
        leadershipScope: 'Senior Pastor & Mission Overseer',
        teachingHoursWeekly: 10,
        pastoralDuties: 'Preaching, ordination, leadership summits, marriage seminars.',
        achievements: 'Established 4 mission stations, constructed 2 permanent worship auditoriums, trained 45 lay evangelists.'
      }
    ],
    competencies: [
      {
        id: 'comp-201',
        learningOutcome: 'Formulate advanced ecclesiological strategies for cross-cultural church multiplication.',
        courseCode: 'THEO-501',
        courseTitle: 'Advanced Pastoral Ministry & Ecclesiology',
        creditValue: 4,
        selfRating: 5,
        demonstrationMethod: '16 years of church leadership and cross-border missions manuals.',
        applicantNarrative: 'Authored complete training modules for pioneering pastors in cross-border French and English speaking communities.',
        assessorDecision: 'Credit Awarded',
        awardedCredits: 4,
        assessorNotes: 'Exceptional depth of ecclesiological praxis.'
      },
      {
        id: 'comp-202',
        learningOutcome: 'Exemplify master-level expository preaching and homiletic delivery.',
        courseCode: 'MIN-502',
        courseTitle: 'Advanced Expository Homiletics',
        creditValue: 4,
        selfRating: 5,
        demonstrationMethod: 'Video recordings and sermon manuscript series.',
        applicantNarrative: 'Weekly manuscript preaching from Hebrew Old Testament narratives and Pauline epistles.',
        assessorDecision: 'Credit Awarded',
        awardedCredits: 4,
        assessorNotes: 'Video and manuscript review confirmed superior homiletic precision.'
      }
    ],
    evidenceList: [
      {
        id: 'ev-201',
        title: 'Missionary Field Appointment & Ordination Papers',
        classification: 'Direct Evidence',
        type: 'Ministry Ordination & Licenses',
        description: 'Ordination credential issued in 2008 by Apostolic Council of Nigeria.',
        fileName: 'adebayo_ordination_papers.pdf',
        fileSize: '3.1 MB',
        issuingOrganization: 'Apostolic Council of Nigeria',
        dateIssued: '2008-05-14',
        verificationStatus: 'Verified',
        assessorComments: 'Authenticity confirmed with regional synod office.',
        score: 96
      },
      {
        id: 'ev-202',
        title: 'West Africa Church Planting Handbook & Field Reports',
        classification: 'Documentary Evidence',
        type: 'Publications & Training Manuals',
        description: 'Published 120-page missionary handbook used across 4 regional stations.',
        fileName: 'missionary_handbook_westafrica.pdf',
        fileSize: '6.4 MB',
        issuingOrganization: 'Redeemed Apostolic Publications',
        dateIssued: '2021-09-10',
        verificationStatus: 'Verified',
        assessorComments: 'Superb publication quality with practical mission methodologies.',
        score: 98
      }
    ],
    reflectiveStatements: {
      callingAndPhilosophy: 'Ministry is a divine stewardship. Over 16 years of pastoral and cross-cultural mission, my aim has been building resilient, self-governing local bodies rooted in the Word.',
      biblicalTheologicalGrowth: 'Theological clarity prevents syncretism in the mission field. I emphasize systematic biblical literacy across all our training centers.',
      pastoralLeadershipImpact: 'Developed a leadership pipeline where young men and women are discipled into capable pastors, missionaries, and administrators.',
      crossCulturalMissions: 'Bridged cultural and linguistic divides in francophone West Africa, establishing viable churches among unreached communities.'
    },
    references: [
      {
        id: 'ref-201',
        name: 'Archbishop Emmanuel Adeleke',
        roleTitle: 'General Overseer',
        organization: 'Apostolic Fellowship of West Africa',
        email: 'e.adeleke@afwa-lagos.org',
        phone: '+234 802 888 7777',
        relationshipYears: 16,
        referenceLetterStatus: 'Received',
        referenceNotes: 'Unreservedly endorses Pastor Adebayo for advanced academic credit in divinity.'
      }
    ],
    declarationConfirmed: true,
    digitalSignature: 'Grace N. Adebayo (Signed Digitally)',
    submissionDate: '2026-01-15',
    requestedCredits: 16,
    potentialCreditsEstimated: 16,
    approvedCredits: 8,
    feeAmountUSD: 310,
    feeStatus: 'Paid',
    paymentReceiptNumber: 'BIBU-PAY-RPL-8812',
    status: 'Credit Approved',
    progressPercentage: 100,
    assessorName: 'Dr. Michael Sterling, Th.D.',
    assessorConflictDeclared: true,
    assessmentMethodsUsed: ['Portfolio assessment', 'Structured interview', 'Sermon evaluation'],
    assessorNotes: 'Approved 8 credits for Advanced Pastoral Ministry (THEO-501) and Advanced Homiletics (MIN-502). Outstanding portfolio.',
    assessmentDate: '2026-01-25',
    interviewScheduledDate: '2026-01-22',
    interviewNotes: 'Interview conducted via Zoom. Exceptional academic and practical comprehension displayed.',
    interviewResult: 'Passed',
    moderatorName: 'Dr. Elizabeth Warren, Academic Dean',
    academicDeanApprovalDate: '2026-01-28',
    transcriptEntryConfirmed: true,
    appeals: [],
    auditLogs: [
      {
        id: 'log-201',
        timestamp: '2026-01-15 10:20:00',
        actorName: 'Grace N. Adebayo',
        actorRole: 'Applicant',
        action: 'Application Submitted',
        notes: 'Submitted portfolio for Master of Divinity RPL evaluation.'
      },
      {
        id: 'log-202',
        timestamp: '2026-01-28 14:00:00',
        actorName: 'Dr. Elizabeth Warren',
        actorRole: 'Academic Dean',
        action: 'Credit Conferred',
        notes: 'Ratified 8 academic credits.'
      }
    ]
  },
  {
    id: 'rpl-app-003',
    applicationNumber: 'BIBU-RPL-2026-000103',
    verificationCode: 'VRPL-55420-AZ',
    applicantName: 'Rev. Thomas Edward Vance',
    email: 't.vance@livinghopechurch.us',
    phone: '+1 (480) 555-9821',
    country: 'United States',
    nationality: 'American',
    dateOfBirth: '1975-03-22',
    churchAffiliation: 'Living Hope Community Chapel, Phoenix, AZ',
    currentRole: 'Senior Pastor',
    yearsInMinistry: 20,
    highestAcademicLevel: 'Bachelor of Science in Business Administration',
    desiredProgramId: 'prog-dmin-01',
    desiredProgramName: 'Doctor of Ministry (D.Min) in Apostolic Leadership',
    schoolId: 'sch-theology',
    ministryPositions: [
      {
        id: 'pos-301',
        organization: 'Living Hope Community Chapel',
        positionTitle: 'Senior Pastor & Founder',
        startDate: '2004-09-01',
        endDate: 'Present',
        isCurrent: true,
        country: 'United States',
        cityLocation: 'Phoenix & Scottsdale, AZ',
        responsibilities: '20 years of apostolic leadership, 850 congregation members, supervision of 14 pastoral and administrative staff.',
        peopleServed: '850+ Active Members',
        leadershipScope: 'Senior Pastor & Executive Board Chairman',
        teachingHoursWeekly: 10,
        pastoralDuties: 'Senior preaching, leadership institute founder, community civic engagement.',
        achievements: 'Grew church from 12 people to 850, completed $3.5M building capital campaign, founded Phoenix Hope Food Distribution.'
      }
    ],
    competencies: [
      {
        id: 'comp-301',
        learningOutcome: 'Evaluate strategic ecclesial leadership models and organizational resilience.',
        courseCode: 'LEAD-701',
        courseTitle: 'Strategic Ecclesial Leadership & Organizational Development',
        creditValue: 5,
        selfRating: 5,
        demonstrationMethod: 'Capital campaign portfolio, staff development manuals, board policies.',
        applicantNarrative: 'Built scalable church governance systems over two decades, balancing spiritual vision with fiscal integrity.',
        assessorDecision: 'Pending',
        assessorNotes: 'Under review by Doctor of Ministry faculty committee.'
      }
    ],
    evidenceList: [
      {
        id: 'ev-301',
        title: 'Living Hope Ministry Charter & Strategic 10-Year Plan',
        classification: 'Documentary Evidence',
        type: 'Church Administration & Policy Documents',
        description: 'Comprehensive 85-page strategic planning and discipleship handbook.',
        fileName: 'living_hope_strategic_charter.pdf',
        fileSize: '5.5 MB',
        issuingOrganization: 'Living Hope Chapel Board',
        dateIssued: '2022-01-10',
        verificationStatus: 'Verified',
        assessorComments: 'High institutional caliber.',
        score: 94
      }
    ],
    reflectiveStatements: {
      callingAndPhilosophy: 'Ministry is the stewardship of souls and the cultivation of Christ-centered community.',
      biblicalTheologicalGrowth: 'Committed to ongoing research in historical theology and leadership praxis.',
      pastoralLeadershipImpact: 'Developed multiple associate pastors who now lead independent congregations.',
      crossCulturalMissions: 'Partnerships with church planting networks in Latin America and East Africa.'
    },
    references: [
      {
        id: 'ref-301',
        name: 'Dr. Howard Sterling',
        roleTitle: 'Senior Fellow',
        organization: 'Arizona Pastors Alliance',
        email: 'h.sterling@azpastors.org',
        phone: '+1 (602) 555-8833',
        relationshipYears: 18,
        referenceLetterStatus: 'Received'
      }
    ],
    declarationConfirmed: true,
    digitalSignature: 'Thomas Edward Vance (Electronic Signature)',
    submissionDate: '2026-02-14',
    requestedCredits: 10,
    potentialCreditsEstimated: 10,
    approvedCredits: 0,
    feeAmountUSD: 200,
    feeStatus: 'Paid',
    paymentReceiptNumber: 'BIBU-PAY-RPL-7731',
    status: 'Under Assessment',
    progressPercentage: 65,
    assessorName: 'Prof. John Mark Abernathy, Ph.D.',
    assessorConflictDeclared: true,
    assessmentMethodsUsed: ['Portfolio assessment', 'Reflective essay'],
    interviewScheduledDate: '2026-03-05',
    transcriptEntryConfirmed: false,
    appeals: [],
    auditLogs: [
      {
        id: 'log-301',
        timestamp: '2026-02-14 11:00:00',
        actorName: 'Rev. Thomas Edward Vance',
        actorRole: 'Applicant',
        action: 'Application Submitted',
        notes: 'Submitted D.Min RPL portfolio for strategic leadership credit review.'
      }
    ]
  },
  {
    id: 'rpl-app-004',
    applicationNumber: 'BIBU-RPL-2026-000104',
    verificationCode: 'VRPL-11928-AZ',
    applicantName: 'Pastor Sarah Christine Jenkins',
    email: 'pastor.sarah@newlifechaplaincy.org',
    phone: '+1 (773) 555-4422',
    country: 'United States',
    nationality: 'American',
    dateOfBirth: '1988-09-05',
    churchAffiliation: 'New Life Christian Fellowship & Hospital Chaplaincy, Chicago',
    currentRole: 'Hospital Chaplain & Associate Pastor',
    yearsInMinistry: 8,
    highestAcademicLevel: 'Bachelor of Science in Psychology',
    desiredProgramId: 'prog-bth-01',
    desiredProgramName: 'Bachelor of Theology (B.Th)',
    schoolId: 'sch-theology',
    ministryPositions: [
      {
        id: 'pos-401',
        organization: 'Memorial Health System & New Life Fellowship',
        positionTitle: 'Staff Chaplain & Pastoral Counselor',
        startDate: '2018-06-01',
        endDate: 'Present',
        isCurrent: true,
        country: 'United States',
        cityLocation: 'Chicago, IL',
        responsibilities: 'Hospital clinical chaplaincy, ICU trauma response, grief support groups, weekly chapel services.',
        peopleServed: 'Over 1,200 patients and family members annually',
        leadershipScope: 'Clinical Pastoral Supervisor',
        teachingHoursWeekly: 4,
        pastoralDuties: 'Spiritual triage, bereavement counseling, end-of-life pastoral presence.',
        achievements: 'Authored hospital pastoral crisis protocol adopted by three regional healthcare facilities.'
      }
    ],
    competencies: [
      {
        id: 'comp-401',
        learningOutcome: 'Apply ethical pastoral care principles in healthcare and crisis trauma settings.',
        courseCode: 'COUN-201',
        courseTitle: 'Biblical Counseling & Pastoral Care',
        creditValue: 3,
        selfRating: 5,
        demonstrationMethod: '8 years clinical chaplaincy and bereavement protocol manual.',
        applicantNarrative: 'Provided bedside pastoral ministry in critical care units, adhering strictly to ethics and compassionate biblical comfort.',
        assessorDecision: 'Credit Awarded',
        awardedCredits: 3,
        assessorNotes: 'Superb clinical counseling credentials.'
      }
    ],
    evidenceList: [
      {
        id: 'ev-401',
        title: 'Association of Certified Christian Chaplains Board Certification',
        classification: 'Direct Evidence',
        type: 'Ministry Ordination & Licenses',
        description: 'Certified Healthcare Chaplain credential.',
        fileName: 'chaplain_board_certification.pdf',
        fileSize: '2.1 MB',
        issuingOrganization: 'Association of Certified Christian Chaplains',
        dateIssued: '2019-04-10',
        verificationStatus: 'Verified',
        score: 95
      }
    ],
    reflectiveStatements: {
      callingAndPhilosophy: 'Chaplaincy is ministering Christ’s presence in the valley of suffering.',
      biblicalTheologicalGrowth: 'Deepened appreciation for the theology of the Cross and Christian hope in times of tragedy.',
      pastoralLeadershipImpact: 'Trained over 40 volunteer hospital visitors in pastoral listening skills.',
      crossCulturalMissions: 'Served multi-faith and multi-ethnic patient populations with Christ-like grace.'
    },
    references: [
      {
        id: 'ref-401',
        name: 'Rev. Dr. Robert Vance',
        roleTitle: 'Director of Pastoral Care',
        organization: 'Memorial Health',
        email: 'r.vance@memorialhealth.org',
        phone: '+1 (312) 555-1100',
        relationshipYears: 8,
        referenceLetterStatus: 'Received'
      }
    ],
    declarationConfirmed: true,
    digitalSignature: 'Sarah Christine Jenkins',
    submissionDate: '2026-02-01',
    requestedCredits: 12,
    potentialCreditsEstimated: 12,
    approvedCredits: 6,
    feeAmountUSD: 190,
    feeStatus: 'Paid',
    paymentReceiptNumber: 'BIBU-PAY-RPL-6629',
    status: 'Credit Approved',
    progressPercentage: 100,
    assessorName: 'Prof. John Mark Abernathy, Ph.D.',
    assessorConflictDeclared: true,
    assessmentMethodsUsed: ['Portfolio assessment', 'Structured interview'],
    assessorNotes: 'Awarded 6 credits toward COUN-201 and MIN-101. Excellent clinical pastoral documentation.',
    assessmentDate: '2026-02-15',
    transcriptEntryConfirmed: true,
    appeals: [],
    auditLogs: [
      {
        id: 'log-401',
        timestamp: '2026-02-01 14:00:00',
        actorName: 'Sarah Christine Jenkins',
        actorRole: 'Applicant',
        action: 'Application Submitted',
        notes: 'Submitted chaplaincy portfolio for B.Th credit assessment.'
      }
    ]
  }
];
