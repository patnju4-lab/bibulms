export interface RPLSlide {
  id: number;
  slideNumber: number;
  title: string;
  subtitle?: string;
  category: 'intro' | 'standards' | 'documentation' | 'competencies' | 'register';
  keyPoints?: string[];
  details?: { [key: string]: any };
  footerText?: string;
  notes?: string;
}

export const RPL_SLIDE_DECK: RPLSlide[] = [
  {
    id: 1,
    slideNumber: 1,
    title: 'Recognition of Prior Learning (RPL)',
    subtitle: 'RPL Counselling Session & Evidence Collection',
    category: 'intro',
    details: {
      institution: 'Breakthrough International Bible University',
      location: 'Phoenix, Arizona, USA',
      programme: 'Christian Ministry / Theology Programmes',
      motto: 'Equipping Ministers. Transforming Lives. Impacting Nations.',
      badgeText: 'Official Academic Framework'
    },
    footerText: 'BIBU – Equipping Ministers. Transforming Lives. Impacting Nations.',
    notes: 'Official title slide for the RPL candidate intake, preliminary counselling, and evidence scoping session.'
  },
  {
    id: 2,
    slideNumber: 2,
    title: 'PURPOSE OF RPL COUNSELLING',
    category: 'intro',
    keyPoints: [
      'Identify existing knowledge, skills and experience',
      "Establish the candidate's RPL objectives",
      'Identify available evidence',
      'Identify evidence gaps',
      'Plan the assessment process'
    ],
    details: {
      scripture: 'Proverbs 24:3-4',
      scriptureText: 'By wisdom a house is built, and through understanding it is established; through knowledge its rooms are filled with rare and beautiful treasures.'
    },
    footerText: 'BIBU – Equipping Ministers. Transforming Lives. Impacting Nations.',
    notes: 'The primary goal is orientation and strategic planning—scoping what exists versus what is needed.'
  },
  {
    id: 3,
    slideNumber: 3,
    title: 'WHAT COUNTS AS RPL EVIDENCE?',
    subtitle: 'The 5 Essential Quality Standards (A.R.S.C.V.)',
    category: 'standards',
    details: {
      standards: [
        {
          name: 'AUTHENTIC',
          definition: 'Genuine and created by the candidate or reliable source',
          tag: 'Verification Check',
          description: 'Documents must be directly traceable to the applicant, on official church letterhead, or independently verifiable.'
        },
        {
          name: 'RELEVANT',
          definition: 'Directly related to the unit or competency',
          tag: 'Curriculum Fit',
          description: 'Experience must match specific academic learning outcomes within theological and pastoral curricula.'
        },
        {
          name: 'SUFFICIENT',
          definition: 'Enough to demonstrate competence',
          tag: 'Breadth & Depth',
          description: 'A single one-hour sermon is insufficient; multiple longitudinal records over years of service are required.'
        },
        {
          name: 'CURRENT',
          definition: 'Up to date and within a reasonable timeframe',
          tag: 'Contemporary Practice',
          description: 'Recent and active pastoral or ministry engagement, demonstrating active continuous competency.'
        },
        {
          name: 'VERIFIABLE',
          definition: 'Can be checked and confirmed by an independent person',
          tag: 'Audit Trail',
          description: 'Independent third-party witnesses, governing boards, denominational overseers, or public digital records.'
        }
      ]
    },
    footerText: 'BIBU – Equipping Ministers. Transforming Lives. Impacting Nations.',
    notes: 'Assessors and candidates must ensure every submitted piece of evidence satisfies all 5 quality criteria.'
  },
  {
    id: 4,
    slideNumber: 4,
    title: 'CANDIDATE RPL COUNSELLING FORM',
    subtitle: 'Intake Questionnaire & Diagnostic Mapping',
    category: 'documentation',
    keyPoints: [
      'Candidate details (Legal name, contact, church affiliation, student ID)',
      'Programme/unit being assessed (Target degree level and course modules)',
      'Ministry experience summary (Years served, congregational scope, ordinations)',
      "Candidate's RPL objectives (Desired advanced standing, graduation timeline)",
      'Previous learning and training (Seminaries, diplomas, certificates, workshops)'
    ],
    details: {
      formFields: [
        { label: 'Candidate Name', example: 'Rev. Samuel Boateng' },
        { label: 'Target Program', example: 'Bachelor of Theology (B.Th)' },
        { label: 'Ministry Experience', example: '12 Years Senior Pastor' },
        { label: 'RPL Objectives', example: 'Advanced standing in Pastoral Theology' },
        { label: 'Previous Learning', example: 'Diploma in Christian Ministry (2012)' }
      ]
    },
    footerText: 'BIBU – Equipping Ministers. Transforming Lives. Impacting Nations.',
    notes: 'The initial intake instrument completed collaboratively by candidate and academic advisor.'
  },
  {
    id: 5,
    slideNumber: 5,
    title: 'MINISTRY EXPERIENCE EVIDENCE',
    subtitle: 'Institutional & Denominational Validation',
    category: 'documentation',
    keyPoints: [
      'Church appointment / ordination letters',
      'Employment or ministry service letters',
      'Leadership appointment letters',
      'Church membership / service records',
      'Evidence of years of ministry experience'
    ],
    details: {
      tip: 'Must bear official church seal, board signature, or denominational headquarters authorization.'
    },
    footerText: 'BIBU – Equipping Ministers. Transforming Lives. Impacting Nations.',
    notes: 'Formal documentation verifying the institutional scope, duration, and legal authorization of ministry.'
  },
  {
    id: 6,
    slideNumber: 6,
    title: 'SERMON & TEACHING EVIDENCE',
    subtitle: 'Homiletical & Hermeneutical Artefacts',
    category: 'documentation',
    keyPoints: [
      'Sermon outlines (manuscripts, homiletic points, exegetical structures)',
      'Bible study notes (curriculum series, doctrinal expositions)',
      'Teaching materials (discipleship modules, leadership handouts)',
      'Recorded sermons or teaching sessions (audio/video files or URLs)',
      'Church programmes showing preaching/teaching assignments'
    ],
    details: {
      learningOutcome: 'Satisfies: BIB-301 Hermeneutics, PAS-202 Homiletics & Expository Preaching.'
    },
    footerText: 'BIBU – Equipping Ministers. Transforming Lives. Impacting Nations.',
    notes: 'Demonstrates theological literacy, biblical interpretation, and verbal proclamation capability.'
  },
  {
    id: 7,
    slideNumber: 7,
    title: 'PASTORAL CARE EVIDENCE',
    subtitle: 'Shepherding, Counseling & Compassionate Ministry',
    category: 'documentation',
    keyPoints: [
      'Pastoral visitation records (hospital, home, shut-in ministries)',
      'Counselling session records (anonymized confidential logs)',
      'Bereavement / ministry support records (funeral orders, grief support)',
      'Hospital or home visitation evidence (chaplaincy verification)',
      'Referral records, where applicable (collaboration with medical/mental health providers)'
    ],
    details: {
      ethicsNote: 'Strict confidentiality: all patient/counselee personal identifying information must be redacted.'
    },
    footerText: 'BIBU – Equipping Ministers. Transforming Lives. Impacting Nations.',
    notes: 'Evidences pastoral ethics, empathy, crisis intervention, and spiritual direction.'
  },
  {
    id: 8,
    slideNumber: 8,
    title: 'LEADERSHIP & ADMINISTRATION EVIDENCE',
    subtitle: 'Governance, Stewardship & Institutional Oversight',
    category: 'documentation',
    keyPoints: [
      'Church committee minutes (board meetings, elder council minutes)',
      'Leadership reports (quarterly progress, ministry department audits)',
      'Church development plans (strategic vision, facility expansion plans)',
      'Meeting agendas and minutes (staff meetings, planning retreats)',
      'Church financial / administrative responsibilities (budget oversight, audits)',
      'Project management records (crusades, anniversary celebrations, conferences)'
    ],
    details: {
      learningOutcome: 'Satisfies: LED-301 Christian Leadership & Church Administration.'
    },
    footerText: 'BIBU – Equipping Ministers. Transforming Lives. Impacting Nations.',
    notes: 'Proves managerial maturity, constitutional governance, and financial stewardship.'
  },
  {
    id: 9,
    slideNumber: 9,
    title: 'EVANGELISM, MISSION & COMMUNITY SERVICE',
    subtitle: 'Great Commission Outreach & Societal Impact',
    category: 'documentation',
    keyPoints: [
      'Evangelism reports (open-air crusades, door-to-door, tract distribution)',
      'Mission trip records (cross-cultural missions, international outreaches)',
      'Outreach programmes (food pantries, prison chaplaincy, youth camps)',
      'Church-planting evidence (daughter assemblies established, branch records)',
      'Community service activities (civic engagement, disaster relief)',
      'Photographs or videos of ministry activities (dated visual documentation)'
    ],
    details: {
      learningOutcome: 'Satisfies: MIS-201 Global Missions & Apostolic Church Planting.'
    },
    footerText: 'BIBU – Equipping Ministers. Transforming Lives. Impacting Nations.',
    notes: 'Captures missional praxis, cross-cultural competence, and community benevolence.'
  },
  {
    id: 10,
    slideNumber: 10,
    title: 'TRAINING & PROFESSIONAL DEVELOPMENT',
    subtitle: 'Formal, Non-Formal & Continuing Education',
    category: 'documentation',
    keyPoints: [
      'Certificates (seminary short courses, institute diplomas)',
      'Short courses (specialized biblical seminars, expository workshops)',
      'Workshops and seminars attended (pastoral enrichment, church growth)',
      'Bible school / theological training records (transcripts, syllabi)',
      'Continuing professional development (CPD) evidence (licensure renewal, CEUs)'
    ],
    details: {
      creditTransfer: 'Subject to academic articulation mapping against BIBU accredited modules.'
    },
    footerText: 'BIBU – Equipping Ministers. Transforming Lives. Impacting Nations.',
    notes: 'Validates non-degree certifications and ongoing lifelong learning pursuits.'
  },
  {
    id: 11,
    slideNumber: 11,
    title: 'CANDIDATE REFLECTIVE EVIDENCE',
    subtitle: 'Theological Self-Evaluation & Critical Synthesis',
    category: 'documentation',
    keyPoints: [
      'Written reflection on ministry experience (theological narrative)',
      'Description of major ministry responsibilities (scope, authority, stewardship)',
      'Challenges encountered and how they were handled (conflict resolution)',
      'Examples demonstrating problem-solving and leadership (crisis leadership)',
      'Lessons learned from ministry practice (theological maturational insight)'
    ],
    details: {
      format: '2,000–3,000 word structured reflective statement submitted with portfolio.'
    },
    footerText: 'BIBU – Equipping Ministers. Transforming Lives. Impacting Nations.',
    notes: 'Crucial component demonstrating that experience has been converted into cognitive wisdom and reflection.'
  },
  {
    id: 12,
    slideNumber: 12,
    title: 'COUNSELLOR / ASSESSOR INTERVIEW NOTES',
    subtitle: 'Oral Examination & Competency Cross-Examination',
    category: 'documentation',
    keyPoints: [
      'Questions asked (structured competency questions per syllabus outcomes)',
      "Candidate's responses (verbal defense of theology, doctrine, and praxis)",
      'Competencies demonstrated (assessed against academic benchmarks)',
      'Areas requiring further evidence (identified gaps to be bridged)',
      "Assessor's observations (ministerial demeanor, integrity, doctrinal soundness)"
    ],
    details: {
      assessorRole: 'Conducted by faculty members with subject-matter expertise.'
    },
    footerText: 'BIBU – Equipping Ministers. Transforming Lives. Impacting Nations.',
    notes: 'Validates authenticity through interactive oral defense and clarification of portfolio items.'
  },
  {
    id: 13,
    slideNumber: 13,
    title: 'THIRD-PARTY & DIGITAL VERIFICATION',
    subtitle: 'Corroborating Testimonies & Digital Footprint',
    category: 'documentation',
    details: {
      thirdParty: [
        'Referee statements (senior ministers, elders, ecclesiastical overseers)',
        'Pastor / supervisor confirmation (formal attestation letter)',
        'Church leader verification (board chair, elder signatures)',
        'Employer or ministry organisation confirmation (accrediting bodies)'
      ],
      digital: [
        'Ministry website / social media records (verified online presence)',
        'Online sermons (live streams, recorded archives)',
        'YouTube teaching / preaching links (verifiable video corpus)',
        'Digital ministry reports (PDF newsletters, digital bulletins)',
        'Electronic church records (management systems, financial reports)'
      ]
    },
    footerText: 'BIBU – Equipping Ministers. Transforming Lives. Impacting Nations.',
    notes: 'Independent corroboration guarantees integrity, preventing fraudulent or inflated claims.'
  },
  {
    id: 14,
    slideNumber: 14,
    title: 'EVIDENCE OF COMPETENCE',
    subtitle: '8 Core Competency Domains in Ministerial Education',
    category: 'competencies',
    details: {
      domains: [
        { name: 'KNOWLEDGE', desc: 'Systematic theology, biblical languages, church history, hermeneutics' },
        { name: 'PRACTICAL SKILLS', desc: 'Sermon preparation, pulpit delivery, ordinance administration' },
        { name: 'COMMUNICATION', desc: 'Preaching, teaching, interpersonal empathy, public articulation' },
        { name: 'LEADERSHIP', desc: 'Vision casting, delegation, board oversight, staff management' },
        { name: 'ETHICAL CONDUCT', desc: 'Pastoral integrity, financial accountability, confidentiality' },
        { name: 'PASTORAL COMPETENCE', desc: 'Spiritual direction, grief support, crisis counseling, prayer' },
        { name: 'PROBLEM-SOLVING', desc: 'Church reconciliation, conflict mediation, cultural adaptation' },
        { name: 'COMMUNITY ENGAGEMENT', desc: 'Civic outreach, benevolent relief, evangelistic community presence' }
      ],
      scriptureQuote: '"And whatever you do, in word or deed, do everything in the name of the Lord Jesus, giving thanks to God the Father through him."',
      scriptureRef: 'Colossians 3:17'
    },
    footerText: 'BIBU – Equipping Ministers. Transforming Lives. Impacting Nations.',
    notes: 'All prior learning must map onto one or more of these 8 core ministerial competency pillars.'
  },
  {
    id: 15,
    slideNumber: 15,
    title: 'RPL EVIDENCE REGISTER & KEY PRINCIPLE',
    subtitle: 'Comprehensive Assessment Matrix & Golden Rule of RPL',
    category: 'register',
    details: {
      registerRows: [
        { no: 1, item: 'Ministry appointment letter', source: 'Church Board', verified: 'Yes / No', unit: 'Ministry Leadership', action: 'Submit original letterhead' },
        { no: 2, item: 'Sermon outlines', source: 'Candidate archive', verified: 'Yes / No', unit: 'Biblical Teaching & Homiletics', action: 'Provide 5 sample manuscripts' },
        { no: 3, item: 'Pastoral visitation records', source: 'Church registry', verified: 'Yes / No', unit: 'Pastoral Care & Visitation', action: 'Redacted logs submission' },
        { no: 4, item: 'Counselling records', source: 'Candidate / Church', verified: 'Yes / No', unit: 'Christian Counselling', action: 'Case reflection summary' },
        { no: 5, item: 'Church committee minutes', source: 'Church secretary', verified: 'Yes / No', unit: 'Church Administration', action: 'Certified minutes excerpt' },
        { no: 6, item: 'Training certificates', source: 'Training Institution', verified: 'Yes / No', unit: 'Relevant Units', action: 'Certified copies required' },
        { no: 7, item: 'Mission / outreach reports', source: 'Missions Dept', verified: 'Yes / No', unit: 'Evangelism & Missions', action: 'Field report & photo archive' },
        { no: 8, item: 'Referee statement', source: 'Presiding Bishop', verified: 'Yes / No', unit: 'Ministerial Ethics & Character', action: 'Direct confidential return' },
        { no: 9, item: 'Recorded sermon / video', source: 'Digital / YouTube', verified: 'Yes / No', unit: 'Preaching & Communication', action: 'Active URL or MP4 file' },
        { no: 10, item: 'Candidate reflection', source: 'Candidate essay', verified: 'Yes / No', unit: 'Multiple Competencies', action: '2,500-word essay submitted' }
      ],
      keyPrincipleHeader: 'KEY PRINCIPLE',
      keyPrincipleText1: 'Counselling is the stage where the assessor helps determine what evidence already exists, what is missing, and which evidence can be used to support the RPL assessment.',
      keyPrincipleText2: 'The counselling session itself does NOT automatically prove competence.'
    },
    footerText: 'BIBU – Equipping Ministers. Transforming Lives. Impacting Nations.',
    notes: 'The concluding master principle: counselling scopes and plans; rigorous assessment confers credit.'
  }
];
