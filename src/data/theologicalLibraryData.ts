import {
  LibraryResource,
  PastoralProtocol,
  BiblicalWordEntry,
  FacultyReadingAssignment
} from '../types';

export const COMPREHENSIVE_LIBRARY_RESOURCES: LibraryResource[] = [
  // 1. BIBLE STUDIES & HERMENEUTICS
  {
    id: 'lib-res-001',
    title: 'Grammatical-Historical Exegesis: A Practitioner’s Guide to Biblical Interpretation',
    author: 'Dr. Thomas E. Wright, Ph.D., D.D.',
    publisher: 'BIBU Academic Press (Phoenix, AZ)',
    category: 'Biblical Studies',
    collectionCategory: 'Bible Studies',
    resourceType: 'Grammar & Syntax Manual',
    format: 'PDF',
    pagesOrDuration: '280 pages',
    year: 2024,
    academicLevel: 'Master',
    language: 'English (with Greek & Hebrew Transliteration)',
    scriptureReferences: ['2 Timothy 2:15', 'Nehemiah 8:8', '2 Peter 1:20-21', 'Luke 24:27'],
    keywords: ['Hermeneutics', 'Exegesis', 'Syntax', 'Historical Context', 'Literary Genre', 'Authorial Intent'],
    isbnOrDoi: 'ISBN 978-1-954820-11-4',
    peerReviewed: true,
    licenseType: 'BIBU Institutional License',
    isPopular: true,
    isFeatured: true,
    isRecommended: true,
    coverColor: 'bg-[#002366]',
    assignedCourseCodes: ['HER-301', 'THE-201', 'PAS-401'],
    description: 'An authoritative manual detailing rigorous lexical semantics, syntactic diagramming, historical-cultural framing, and homiletical bridging for pastoral scholarship.',
    abstract: 'This treatise outlines the canonical and grammatical foundations of sound exegesis. It establishes the priority of authorial intent against reader-response subjectivism, providing clear protocols for word studies, rhetorical structure analysis, and redemptive-historical contextualization in the 21st-century ministry setting.',
    tableOfContents: [
      { title: 'Chapter 1: The Epistemology of Divine Revelation', page: 1 },
      { title: 'Chapter 2: The Historical-Cultural Horizon of the Text', page: 34 },
      { title: 'Chapter 3: Lexical Semantics & Fallacies in Word Studies', page: 78 },
      { title: 'Chapter 4: Syntax and Discourse Analysis in Koine Greek', page: 130 },
      { title: 'Chapter 5: Literary Genres: Narrative, Poetry, Prophecy & Epistle', page: 185 },
      { title: 'Chapter 6: From Text to Pulpit: Homiletical Synthesis', page: 242 }
    ],
    fullTextContent: `CHAPTER 1: THE EPISTEMOLOGY OF DIVINE REVELATION

1.1 The Nature of Sacred Scripture
Christian hermeneutics begins with the foundational confession that the Holy Scriptures of the Old and New Testaments are verbally inspired by God (theopneustos, 2 Tim. 3:16) and given through human authors who spoke from God as they were carried along by the Holy Spirit (2 Pet. 1:21). Because God is truthful, His written Word communicates propositional, historical, and redemptive truth with absolute reliability and authority.

1.2 The Exegetical Mandate
The interpreter's solemn task is exegesis (exēgeomai—to draw out what the Spirit authored), never eisegesis (reading our contemporary biases into the holy text). A text cannot mean what it never meant to the original author and original covenant community. Diligent grammatical inquiry, lexical study, and historical background analysis serve not to supplant the Spirit, but to humble our minds beneath the exact words given by divine inspiration.

1.3 The Analogy of Faith (Analogia Fidei)
Because Scripture possesses one divine Author throughout 66 canonical books, it exhibits perfect systemic harmony. The clearer passages of Scripture must always illuminate and govern the interpretation of obscure or difficult passages. We interpret Scripture by Scripture.`,
    citationApa: 'Wright, T. E. (2024). Grammatical-Historical Exegesis: A Practitioner’s Guide to Biblical Interpretation. BIBU Academic Press.',
    citationMla: 'Wright, Thomas E. Grammatical-Historical Exegesis: A Practitioner’s Guide to Biblical Interpretation. BIBU Academic Press, 2024.',
    citationChicago: 'Wright, Thomas E. 2024. Grammatical-Historical Exegesis: A Practitioner’s Guide to Biblical Interpretation. Phoenix, AZ: BIBU Academic Press.',
    citationHarvard: 'Wright, T.E., 2024. Grammatical-Historical Exegesis: A Practitioner’s Guide to Biblical Interpretation. Phoenix, AZ: BIBU Academic Press.'
  },
  {
    id: 'lib-res-002',
    title: 'Covenantal Typology in the Old Testament: Shadow and Substance in Christ',
    author: 'Dr. Jonathan Vance, Th.D.',
    publisher: 'Evangelical Theological Society Monograph Series',
    category: 'Biblical Studies',
    collectionCategory: 'Bible Studies',
    resourceType: 'Systematic Treatise',
    format: 'PDF',
    pagesOrDuration: '340 pages',
    year: 2023,
    academicLevel: 'Doctorate',
    language: 'English (Hebrew & Greek citations)',
    scriptureReferences: ['Genesis 3:15', 'Genesis 12:1-3', 'Exodus 12:1-14', '2 Samuel 7:12-16', 'Hebrews 8:1-13'],
    keywords: ['Covenant Theology', 'Typology', 'Christology', 'Old Testament', 'Messianic Prophecy'],
    isbnOrDoi: 'DOI: 10.1080/bibu.theo.2023.094',
    peerReviewed: true,
    licenseType: 'Authorized Academic Use',
    isPopular: true,
    isFeatured: true,
    coverColor: 'bg-[#0F284B]',
    assignedCourseCodes: ['THE-201', 'HER-301'],
    description: 'A comprehensive investigation into the theological organic progression from the Adamic, Noahic, Abrahamic, Mosaic, and Davidic covenants to their consummation in Jesus Christ.',
    abstract: 'This volume traces the unfolding divine covenants through the historical narrative of Israel, demonstrating that Old Testament offices (Prophet, Priest, King), institutions (Temple, Sacrificial System), and historical events serve as divinely ordained types culminating in the Person and substitutionary work of Christ.',
    citationApa: 'Vance, J. (2023). Covenantal Typology in the Old Testament: Shadow and Substance in Christ. ETS Monograph Series.',
    citationMla: 'Vance, Jonathan. Covenantal Typology in the Old Testament: Shadow and Substance in Christ. ETS Monograph Series, 2023.',
    citationChicago: 'Vance, Jonathan. 2023. Covenantal Typology in the Old Testament: Shadow and Substance in Christ. Phoenix, AZ: ETS Monograph Series.',
    citationHarvard: 'Vance, J., 2023. Covenantal Typology in the Old Testament. Phoenix, AZ: ETS Monograph Series.'
  },

  // 2. EXEGETICAL COMMENTARIES LINKED TO PASSAGES
  {
    id: 'lib-res-003',
    title: 'An Exegetical & Theological Commentary on Paul’s Epistle to the Romans (Chapters 1–8)',
    author: 'Rev. Dr. Robert Lindqvist, D.Min., Ph.D.',
    publisher: 'BIBU Theological Commentary Series',
    category: 'Biblical Studies',
    collectionCategory: 'Exegetical Commentaries',
    resourceType: 'Exegetical Commentary',
    format: 'PDF',
    pagesOrDuration: '495 pages',
    year: 2025,
    academicLevel: 'Master',
    language: 'English & Koine Greek',
    scriptureReferences: ['Romans 1:16-17', 'Romans 3:21-26', 'Romans 5:1-11', 'Romans 8:1-39'],
    keywords: ['Romans', 'Justification by Faith', 'Sanctification', 'Union with Christ', 'Greek Exegesis', 'Propitiation'],
    isbnOrDoi: 'ISBN 978-1-954820-44-2',
    peerReviewed: true,
    licenseType: 'BIBU Institutional License',
    isPopular: true,
    isFeatured: true,
    isRecommended: true,
    coverColor: 'bg-[#1E3A8A]',
    assignedCourseCodes: ['HER-301', 'THE-201'],
    description: 'Verse-by-verse grammatical and theological exposition of Romans 1–8, with in-depth analysis of justification, imputation of Christ’s righteousness, and life in the Holy Spirit.',
    abstract: 'Focusing on the climax of Pauline soteriology in Romans 8, this commentary provides clause-level Greek analysis, evaluation of the New Perspective on Paul vs. Classical Reformation exegesis, and pastoral reflections on the eternal security of the believer.',
    tableOfContents: [
      { title: 'Introduction: The Historical Situation of the Roman Church', page: 1 },
      { title: 'Romans 1:18–3:20: Universal Human Depravity and the Wrath of God', page: 42 },
      { title: 'Romans 3:21–31: The Righteousness of God Manifested in Christ (Hilasterion)', page: 115 },
      { title: 'Romans 4: Abraham, Justification by Faith Alone, and Imputation', page: 178 },
      { title: 'Romans 5: Peace with God and the Two Federal Heads (Adam & Christ)', page: 235 },
      { title: 'Romans 6: Union with Christ in Death and Resurrection', page: 310 },
      { title: 'Romans 7: The Law, Sin, and the Inner Struggle', page: 375 },
      { title: 'Romans 8: Life in the Spirit, Glorification, and Unbreakable Love', page: 420 }
    ],
    fullTextContent: `EXPOSITION OF ROMANS 8:1–4: NO CONDEMNATION IN CHRIST JESUS

1. The Grand Declaration (Romans 8:1)
"Ouden ara nyn katakrima tois en Christō Iēsou" — "There is therefore now no condemnation for those who are in Christ Jesus."

The inferential particle "ara" (therefore) draws the majestic theological conclusion from all of chapters 3 through 7. The noun "katakrima" refers to the penal servitude and legal sentence of damnation resulting from judicial guilt. In Christ Jesus, the believer's legal standing has been forever transformed: because Christ absorbed the full wrath of God on Calvary, God's justice is satisfied. There remains zero judicial condemnation.

2. The Principle of the Spirit of Life (Romans 8:2)
"Ho gar nomos tou pneumatos tēs zōēs en Christō Iēsou ēleutherōsen se..."
The "law of the Spirit of life" refers not to a legalistic code, but to the sovereign, dynamic ruling power of the Holy Spirit who indwells the regenerated believer, emancipating him from the ruling power of sin and death.`,
    citationApa: 'Lindqvist, R. (2025). An Exegetical & Theological Commentary on Paul’s Epistle to the Romans. BIBU Academic Press.',
    citationMla: 'Lindqvist, Robert. An Exegetical & Theological Commentary on Paul’s Epistle to the Romans. BIBU Academic Press, 2025.',
    citationChicago: 'Lindqvist, Robert. 2025. An Exegetical & Theological Commentary on Paul’s Epistle to the Romans. Phoenix, AZ: BIBU Academic Press.',
    citationHarvard: 'Lindqvist, R., 2025. An Exegetical & Theological Commentary on Paul’s Epistle to the Romans. Phoenix, AZ: BIBU Academic Press.'
  },
  {
    id: 'lib-res-004',
    title: 'The Johannine Logos and Cosmic Christology: Exegesis of John 1:1–18',
    author: 'Dr. Elizabeth R. Montgomery & Dr. Thomas E. Wright',
    publisher: 'Biblical & Patristic Review',
    category: 'Biblical Studies',
    collectionCategory: 'Exegetical Commentaries',
    resourceType: 'Academic Journal Article',
    format: 'Journal',
    pagesOrDuration: '62 pages',
    year: 2024,
    academicLevel: 'Doctorate',
    language: 'English & Greek',
    scriptureReferences: ['John 1:1-18', 'Colossians 1:15-20', 'Hebrews 1:1-4'],
    keywords: ['Gospel of John', 'Logos', 'Incarnation', 'Trinity', 'Koine Greek', 'Christology'],
    isbnOrDoi: 'DOI: 10.1080/johannine.2024.019',
    peerReviewed: true,
    licenseType: 'Open Access',
    isPopular: true,
    coverColor: 'bg-[#1E1B4B]',
    assignedCourseCodes: ['THE-201', 'HER-301'],
    description: 'High-level syntactic and theological study of the Prologue of John, examining the eternal pre-existence, deity, and historical incarnation of the Word.',
    abstract: 'This study analyses John 1:1-18 within the dual context of Old Testament Wisdom theology (Dabar/Chokmah) and Hellenistic philosophical terminology, defending the orthodox Nicene reading of the eternal divinity of Jesus Christ.',
    citationApa: 'Montgomery, E. R., & Wright, T. E. (2024). The Johannine Logos and Cosmic Christology. Biblical & Patristic Review, 14(2), 45-107.',
    citationMla: 'Montgomery, Elizabeth R., and Thomas E. Wright. "The Johannine Logos and Cosmic Christology." Biblical & Patristic Review 14.2 (2024): 45-107.',
    citationChicago: 'Montgomery, Elizabeth R., and Thomas E. Wright. 2024. "The Johannine Logos and Cosmic Christology." Biblical & Patristic Review 14 (2): 45-107.',
    citationHarvard: 'Montgomery, E.R. and Wright, T.E., 2024. The Johannine Logos and Cosmic Christology. Biblical & Patristic Review, 14(2), pp.45-107.'
  },

  // 3. GREEK & HEBREW RESEARCH
  {
    id: 'lib-res-005',
    title: 'Koine Greek Lexicon & Syntactic Morphology Handbook for New Testament Exegesis',
    author: 'BIBU Center for Biblical Languages & Linguistics',
    publisher: 'BIBU Press',
    category: 'Biblical Languages',
    collectionCategory: 'Greek & Hebrew Research',
    resourceType: 'Greek & Hebrew Lexicon',
    format: 'PDF',
    pagesOrDuration: '520 pages',
    year: 2025,
    academicLevel: 'All',
    language: 'Ancient Greek & English',
    scriptureReferences: ['Matthew 1:1–Revelation 22:21'],
    keywords: ['Greek Lexicon', 'Koine Greek', 'Morphology', 'Strong’s Concordance', 'Verbal Aspect', 'Deponent Verbs'],
    isbnOrDoi: 'ISBN 978-1-954820-99-2',
    peerReviewed: true,
    licenseType: 'BIBU Institutional License',
    isPopular: true,
    isFeatured: true,
    coverColor: 'bg-[#1E293B]',
    assignedCourseCodes: ['HER-301'],
    description: 'Comprehensive grammatical catalog covering all major New Testament Greek verbs, nouns, conjunctions, and prepositions with Strong’s cross-references and theological usage.',
    abstract: 'A vital research tool containing over 5,400 Greek lemma entries with full parsing charts, semantic range classifications, and contextual occurrences across the Pauline, Johannine, and Synoptic corpora.',
    citationApa: 'BIBU Center for Biblical Languages. (2025). Koine Greek Lexicon & Syntactic Morphology Handbook. BIBU Press.',
    citationMla: 'BIBU Center for Biblical Languages. Koine Greek Lexicon & Syntactic Morphology Handbook. BIBU Press, 2025.',
    citationChicago: 'BIBU Center for Biblical Languages. 2025. Koine Greek Lexicon & Syntactic Morphology Handbook. Phoenix, AZ: BIBU Press.',
    citationHarvard: 'BIBU Center for Biblical Languages, 2025. Koine Greek Lexicon & Syntactic Morphology Handbook. Phoenix, AZ: BIBU Press.'
  },
  {
    id: 'lib-res-006',
    title: 'Foundations of Biblical Hebrew Grammar, Syntax & Lexicography',
    author: 'Dr. David K. Mensah, Ph.D. & Rev. Dr. Sarah M. Jenkins',
    publisher: 'BIBU Semitic Studies Institute',
    category: 'Biblical Languages',
    collectionCategory: 'Greek & Hebrew Research',
    resourceType: 'Grammar & Syntax Manual',
    format: 'PDF',
    pagesOrDuration: '390 pages',
    year: 2024,
    academicLevel: 'Bachelor',
    language: 'Classical Hebrew & English',
    scriptureReferences: ['Genesis 1:1', 'Deuteronomy 6:4', 'Psalm 23:1', 'Isaiah 53:1-12'],
    keywords: ['Biblical Hebrew', 'Semitic Grammar', 'Binyanim', 'Vowel Pointing', 'Construct State', 'Poetic Parallelism'],
    isbnOrDoi: 'ISBN 978-1-954820-67-1',
    peerReviewed: true,
    licenseType: 'BIBU Institutional License',
    isPopular: true,
    coverColor: 'bg-[#312E81]',
    assignedCourseCodes: ['HER-301', 'THE-201'],
    description: 'Step-by-step introduction to Classical Hebrew verb stems (Qal, Niphal, Piel, Pual, Hiphil, Hophal, Hithpael), noun morphology, and syntactical analysis.',
    abstract: 'Designed for seminarians and pastors to gain practical fluency in reading the Hebrew Masoretic Text, interpreting Old Testament narrative pacing, and translating poetic parallelism.',
    citationApa: 'Mensah, D. K., & Jenkins, S. M. (2024). Foundations of Biblical Hebrew Grammar, Syntax & Lexicography. BIBU Press.',
    citationMla: 'Mensah, David K., and Sarah M. Jenkins. Foundations of Biblical Hebrew Grammar, Syntax & Lexicography. BIBU Press, 2024.',
    citationChicago: 'Mensah, David K., and Sarah M. Jenkins. 2024. Foundations of Biblical Hebrew Grammar, Syntax & Lexicography. Phoenix, AZ: BIBU Press.',
    citationHarvard: 'Mensah, D.K. and Jenkins, S.M., 2024. Foundations of Biblical Hebrew Grammar. Phoenix, AZ: BIBU Press.'
  },

  // 4. RELIGION & CHURCH HISTORY
  {
    id: 'lib-res-007',
    title: 'Patristic Orthodoxy & The Ecumenical Councils (Nicaea 325 to Chalcedon 451)',
    author: 'Dr. Jonathan Vance, Th.D.',
    publisher: 'BIBU Historical Theology Series',
    category: 'Church History',
    collectionCategory: 'Religion & Church History',
    resourceType: 'Historical Patristic Text',
    format: 'PDF',
    pagesOrDuration: '410 pages',
    year: 2023,
    academicLevel: 'Doctorate',
    language: 'English (Greek & Latin excerpts)',
    scriptureReferences: ['John 1:14', 'Philippians 2:5-11', '1 Timothy 3:16'],
    keywords: ['Church Fathers', 'Nicaea', 'Athanasius', 'Chalcedon', 'Homoousios', 'Hypostatic Union'],
    isbnOrDoi: 'ISBN 978-1-954820-33-6',
    peerReviewed: true,
    licenseType: 'Open Access',
    isPopular: true,
    coverColor: 'bg-[#78350F]',
    assignedCourseCodes: ['THE-201'],
    description: 'Definitive historical survey of the early Church Fathers defending the Trinity and the dual natures of Christ against Arianism, Apollinarianism, Nestorianism, and Eutychianism.',
    abstract: 'Traces the theological formulations of the first four Ecumenical Councils, highlighting how patristic defenders safeguarded the biblical gospel through precise creedal definitions.',
    citationApa: 'Vance, J. (2023). Patristic Orthodoxy & The Ecumenical Councils. BIBU Historical Theology Series.',
    citationMla: 'Vance, Jonathan. Patristic Orthodoxy & The Ecumenical Councils. BIBU Historical Theology Series, 2023.',
    citationChicago: 'Vance, Jonathan. 2023. Patristic Orthodoxy & The Ecumenical Councils. Phoenix, AZ: BIBU Historical Theology Series.',
    citationHarvard: 'Vance, J., 2023. Patristic Orthodoxy & The Ecumenical Councils. Phoenix, AZ: BIBU Historical Theology Series.'
  },
  {
    id: 'lib-res-008',
    title: 'The Great Shift: History of African Christianity & Global Pentecostal Expansion',
    author: 'Dr. Samuel Boateng, Ph.D. & Dr. Michael C. Sterling',
    publisher: 'International Missiology Journal Press',
    category: 'Church History',
    collectionCategory: 'Religion & Church History',
    resourceType: 'Faculty Publication',
    format: 'PDF',
    pagesOrDuration: '365 pages',
    year: 2025,
    academicLevel: 'Master',
    language: 'English',
    scriptureReferences: ['Acts 1:8', 'Acts 8:26-40', 'Revelation 7:9-10'],
    keywords: ['African Christianity', 'Pentecostalism', 'Church Growth', 'Global South', 'Missiology', 'Indigenous Churches'],
    isbnOrDoi: 'ISBN 978-1-954820-88-6',
    peerReviewed: true,
    licenseType: 'BIBU Institutional License',
    isPopular: true,
    isFeatured: true,
    coverColor: 'bg-[#064E3B]',
    assignedCourseCodes: ['MIS-302', 'PAS-401'],
    description: 'An authoritative historical analysis of the epicenter of global Christianity shifting toward Sub-Saharan Africa, Latin America, and Asia, with deep focus on Spirit-empowered movements.',
    abstract: 'Examines the explosive growth of Christianity in 20th and 21st century Africa, from the early North African patristic roots (Tertullian, Augustine, Athanasius) to modern revival hubs in East, West, and Central Africa.',
    citationApa: 'Boateng, S., & Sterling, M. C. (2025). The Great Shift: History of African Christianity & Global Pentecostal Expansion. BIBU Press.',
    citationMla: 'Boateng, Samuel, and Michael C. Sterling. The Great Shift: History of African Christianity & Global Pentecostal Expansion. BIBU Press, 2025.',
    citationChicago: 'Boateng, Samuel, and Michael C. Sterling. 2025. The Great Shift: History of African Christianity & Global Pentecostal Expansion. Phoenix, AZ: BIBU Press.',
    citationHarvard: 'Boateng, S. and Sterling, M.C., 2025. The Great Shift: History of African Christianity. Phoenix, AZ: BIBU Press.'
  },

  // 5. PASTORAL MINISTRY LIBRARY
  {
    id: 'lib-res-009',
    title: 'Pastoral Care & Expository Homiletics: Feeding and Shepherding the Flock of God',
    author: 'Rev. Dr. Robert Lindqvist, D.Min. & Dr. Michael C. Sterling',
    publisher: 'BIBU Pastoral Leadership Press',
    category: 'Leadership',
    collectionCategory: 'Pastoral Ministry',
    resourceType: 'E-Book / Monograph',
    format: 'PDF',
    pagesOrDuration: '315 pages',
    year: 2024,
    academicLevel: 'Bachelor',
    language: 'English',
    scriptureReferences: ['1 Peter 5:1-4', 'Acts 20:28', '2 Timothy 4:1-5', 'Titus 1:5-9'],
    keywords: ['Pastoral Theology', 'Homiletics', 'Preaching', 'Shepherding', 'Leadership Ethics', 'Church Health'],
    isbnOrDoi: 'ISBN 978-1-954820-55-8',
    peerReviewed: true,
    licenseType: 'BIBU Institutional License',
    isPopular: true,
    isRecommended: true,
    coverColor: 'bg-[#14532D]',
    assignedCourseCodes: ['PAS-401'],
    description: 'Comprehensive guide to the dual calling of the pastor: expository proclamation of the Word of God from the pulpit and pastoral shepherding in personal care.',
    abstract: 'This volume equips ministers with sermon preparation architectures, pastoral visitation methodologies, crisis counseling frameworks, and character qualifications demanded by the Pastoral Epistles.',
    citationApa: 'Lindqvist, R., & Sterling, M. C. (2024). Pastoral Care & Expository Homiletics. BIBU Pastoral Leadership Press.',
    citationMla: 'Lindqvist, Robert, and Michael C. Sterling. Pastoral Care & Expository Homiletics. BIBU Pastoral Leadership Press, 2024.',
    citationChicago: 'Lindqvist, Robert, and Michael C. Sterling. 2024. Pastoral Care & Expository Homiletics. Phoenix, AZ: BIBU Pastoral Leadership Press.',
    citationHarvard: 'Lindqvist, R. and Sterling, M.C., 2024. Pastoral Care & Expository Homiletics. Phoenix, AZ: BIBU Pastoral Leadership Press.'
  },
  {
    id: 'lib-res-010',
    title: 'Christian Counseling, Grief & Acute Trauma Intervention Protocols',
    author: 'Dr. Elizabeth R. Montgomery, Ph.D.',
    publisher: 'Christian Association for Psychological & Pastoral Studies',
    category: 'Christian Counseling',
    collectionCategory: 'Pastoral Ministry',
    resourceType: 'Systematic Treatise',
    format: 'PDF',
    pagesOrDuration: '290 pages',
    year: 2025,
    academicLevel: 'Master',
    language: 'English',
    scriptureReferences: ['2 Corinthians 1:3-7', 'Psalm 34:18', 'Galatians 6:2', 'James 5:14-16'],
    keywords: ['Christian Counseling', 'Grief Counseling', 'Trauma Care', 'Mental Health', 'Pastoral Boundaries', 'Crisis Intervention'],
    isbnOrDoi: 'ISBN 978-1-954820-72-5',
    peerReviewed: true,
    licenseType: 'Authorized Academic Use',
    isPopular: true,
    coverColor: 'bg-[#115E59]',
    assignedCourseCodes: ['COU-305', 'PAS-401'],
    description: 'Integrating biblical wisdom and clinical assessment for ministers counseling congregants through catastrophic loss, bereavement, domestic crisis, and post-traumatic stress.',
    abstract: 'Provides structured counseling workflows, ethical referral guidelines, legal reporting thresholds, and spiritual care protocols grounded in the comfort of God.',
    citationApa: 'Montgomery, E. R. (2025). Christian Counseling, Grief & Acute Trauma Intervention Protocols. CAPPS Press.',
    citationMla: 'Montgomery, Elizabeth R. Christian Counseling, Grief & Acute Trauma Intervention Protocols. CAPPS Press, 2025.',
    citationChicago: 'Montgomery, Elizabeth R. 2025. Christian Counseling, Grief & Acute Trauma Intervention Protocols. Phoenix, AZ: CAPPS Press.',
    citationHarvard: 'Montgomery, E.R., 2025. Christian Counseling, Grief & Acute Trauma. Phoenix, AZ: CAPPS Press.'
  },

  // 6. PASTORAL PROTOCOLS (INSTITUTIONAL MINISTRY GUIDES)
  {
    id: 'lib-res-011',
    title: 'BIBU Official Pastoral Protocols & Institutional Ministry Manual (Vol. I & II)',
    author: 'BIBU Council of Elders, Pastoral Faculty & Legal Advisors',
    publisher: 'Breakthrough International Bible University Official Press',
    category: 'Pastoral Protocols',
    collectionCategory: 'Pastoral Protocols',
    resourceType: 'Pastoral Protocol',
    format: 'PDF',
    pagesOrDuration: '185 pages',
    year: 2026,
    academicLevel: 'All',
    language: 'English',
    scriptureReferences: ['1 Corinthians 14:40', 'James 5:14', 'Matthew 18:15-20', '1 Peter 5:1-4'],
    keywords: ['Pastoral Protocols', 'Hospital Visitation', 'Bereavement Protocol', 'Child Safeguarding', 'Baptism Procedure', 'Church Discipline', 'Counseling Referral'],
    isbnOrDoi: 'BIBU-PROT-2026-V2',
    peerReviewed: true,
    licenseType: 'BIBU Institutional License',
    isPopular: true,
    isFeatured: true,
    isRecommended: true,
    coverColor: 'bg-[#831843]',
    assignedCourseCodes: ['PAS-401', 'COU-305'],
    description: 'The standardized institutional operating manual for ordained ministers, pastors, elders, and chaplains across 64 member nations.',
    abstract: 'Contains exhaustive, step-by-step institutional procedures for hospital visitation, emergency bereavement care, premarital vetting, child safeguarding policies, baptism administration, and psychological referral criteria.',
    citationApa: 'BIBU Council of Elders. (2026). BIBU Official Pastoral Protocols & Institutional Ministry Manual. BIBU Press.',
    citationMla: 'BIBU Council of Elders. BIBU Official Pastoral Protocols & Institutional Ministry Manual. BIBU Press, 2026.',
    citationChicago: 'BIBU Council of Elders. 2026. BIBU Official Pastoral Protocols & Institutional Ministry Manual. Phoenix, AZ: BIBU Press.',
    citationHarvard: 'BIBU Council of Elders, 2026. BIBU Official Pastoral Protocols. Phoenix, AZ: BIBU Press.'
  },

  // 7. ACADEMIC RESEARCH, THESES & FACULTY MONOGRAPHS
  {
    id: 'lib-res-012',
    title: 'Academic Theological Research, Dissertation Writing & Turabian Methodology Manual',
    author: 'Dr. Deborah K. Alvarez, D.Min., Registrar & Academic Dean',
    publisher: 'BIBU Graduate School of Theology',
    category: 'Research',
    collectionCategory: 'Academic Research & Theses',
    resourceType: 'Theses & Dissertations',
    format: 'PDF',
    pagesOrDuration: '210 pages',
    year: 2025,
    academicLevel: 'Doctorate',
    language: 'English',
    scriptureReferences: ['2 Timothy 2:15', 'Proverbs 25:2', 'Ecclesiastes 12:9-11'],
    keywords: ['Dissertation Manual', 'Turabian Citation', 'Research Methodology', 'Qualitative Theology', 'Peer Review Standards', 'Plagiarism Prevention'],
    isbnOrDoi: 'ISBN 978-1-954820-00-8',
    peerReviewed: true,
    licenseType: 'BIBU Institutional License',
    isPopular: true,
    isFeatured: true,
    coverColor: 'bg-[#1C1917]',
    assignedCourseCodes: ['THE-201', 'HER-301', 'MIS-302'],
    description: 'Official graduate manual governing theological thesis defense, empirical ministry surveys, bibliographical formatting (Chicago/Turabian 17th Ed.), and academic integrity.',
    abstract: 'Provides comprehensive guidelines for developing research proposals, establishing theoretical frameworks, conducting qualitative interviews in ministry settings, and executing rigorous literature reviews.',
    citationApa: 'Alvarez, D. K. (2025). Academic Theological Research & Dissertation Writing Manual. BIBU Graduate Press.',
    citationMla: 'Alvarez, Deborah K. Academic Theological Research & Dissertation Writing Manual. BIBU Graduate Press, 2025.',
    citationChicago: 'Alvarez, Deborah K. 2025. Academic Theological Research & Dissertation Writing Manual. Phoenix, AZ: BIBU Graduate Press.',
    citationHarvard: 'Alvarez, D.K., 2025. Academic Theological Research & Dissertation Writing Manual. Phoenix, AZ: BIBU Graduate Press.'
  },

  // 8. MULTIMEDIA EXPANSION: VIDEO COURSES & LECTURES
  {
    id: 'lib-res-media-001',
    title: 'Mastering New Testament Exegesis & Pauline Greek Syntax (Romans 8 Masterclass)',
    author: 'Dr. Thomas E. Wright, Ph.D., D.D.',
    publisher: 'BIBU Faculty Media Studio (Phoenix, AZ)',
    category: 'Biblical Studies',
    collectionCategory: 'Exegetical Commentaries',
    resourceType: 'Video Course',
    format: 'Video Course',
    pagesOrDuration: '3 Modules (6 Video Lessons • 3h 15m)',
    year: 2026,
    academicLevel: 'Master',
    language: 'English (with Greek syntax diagramming)',
    scriptureReferences: ['Romans 8:1-17', 'Romans 8:18-30', 'Romans 8:31-39', '2 Timothy 2:15'],
    keywords: ['Greek Exegesis', 'Romans 8', 'Pauline Theology', 'Video Course', 'Justification', 'Union with Christ'],
    isbnOrDoi: 'BIBU-VID-2026-EXEG-01',
    peerReviewed: true,
    licenseType: 'BIBU Institutional License',
    licenseClassification: 'BIBU-owned',
    downloadAllowed: true,
    isPopular: true,
    isFeatured: true,
    isRecommended: true,
    coverColor: 'bg-[#002366]',
    assignedCourseCodes: ['HER-301', 'THE-201'],
    videoUrl: 'https://cdn.bibu.edu/media/video/romans8_masterclass.mp4',
    videoDurationSeconds: 11700,
    completionThresholdPercent: 90,
    description: 'An advanced video masterclass guiding theological students through sentence-by-sentence diagramming, original language clause structure, and redemptive applications of Romans 8.',
    abstract: 'Taught by Senior Professor Dr. Thomas E. Wright, this university-level video course equips pastors and scholars with rigorous exegetical methods to distinguish biblical authorial intent from cultural eisegesis.',
    videoModules: [
      {
        id: 'vmod-1',
        moduleNumber: 1,
        title: 'Module 1: Foundations of Exegetical Methodology & Greek Syntax',
        description: 'Historical grammatical frameworks, original language syntax, and hermeneutic principles.',
        lessons: [
          {
            id: 'vles-101',
            lessonNumber: 1,
            title: 'Lesson 1: What is Exegesis? (Exēgeomai vs Eisēgeomai)',
            duration: '22:15',
            durationSeconds: 1335,
            videoUrl: 'https://cdn.bibu.edu/media/video/exegesis_101.mp4',
            description: 'Distinguishing divine authorial intent from modern reader subjectivism.',
            requiredReading: 'Hermeneutics Manual, Chapter 1 (pp. 1–35)',
            quizQuestionsCount: 10,
            assignmentTitle: 'Exegetical Analysis of 2 Timothy 2:15',
            transcript: [
              {
                id: 'vt-1',
                timestampSeconds: 0,
                formattedTimestamp: '00:00',
                speaker: 'Dr. Thomas E. Wright, Ph.D.',
                text: 'Welcome to the Breakthrough International Bible University Masterclass on Biblical Exegesis.'
              },
              {
                id: 'vt-2',
                timestampSeconds: 24,
                formattedTimestamp: '00:24',
                speaker: 'Dr. Thomas E. Wright, Ph.D.',
                text: 'Today we address the definitive distinction between Exegesis (drawing out the meaning the Holy Spirit breathed into the text) versus Eisegesis (reading our personal cultural assumptions into Scripture).',
                scriptureRef: '2 Timothy 2:15'
              },
              {
                id: 'vt-3',
                timestampSeconds: 85,
                formattedTimestamp: '01:25',
                speaker: 'Dr. Thomas E. Wright, Ph.D.',
                text: 'In Koine Greek, the verb exēgeomai denotes to lead out, narrate, or unfold. We stand under the authority of the Word, not above it.'
              },
              {
                id: 'vt-4',
                timestampSeconds: 150,
                formattedTimestamp: '02:30',
                speaker: 'Dr. Thomas E. Wright, Ph.D.',
                text: 'Look at Paul’s instruction in Romans 8:1: Ouden ara nyn katakrima tois en Christō Iēsou. Every particle and verbal case carries immense theological weight.',
                scriptureRef: 'Romans 8:1'
              }
            ]
          },
          {
            id: 'vles-102',
            lessonNumber: 2,
            title: 'Lesson 2: Historical & Cultural Contextual Framing',
            duration: '28:40',
            durationSeconds: 1720,
            videoUrl: 'https://cdn.bibu.edu/media/video/exegesis_102.mp4',
            description: 'Greco-Roman epistolary rhetoric and First Century Roman church dynamics.',
            transcript: [
              {
                id: 'vt-5',
                timestampSeconds: 0,
                formattedTimestamp: '00:00',
                speaker: 'Dr. Thomas E. Wright, Ph.D.',
                text: 'In this second lesson, we explore the historical-cultural horizon of the Roman congregation in AD 57.'
              }
            ]
          }
        ]
      }
    ],
    citationApa: 'Wright, T. E. (2026). Mastering New Testament Exegesis & Pauline Greek Syntax. BIBU Media Press.',
    citationMla: 'Wright, Thomas E. Mastering New Testament Exegesis & Pauline Greek Syntax. BIBU Media Press, 2026.',
    citationChicago: 'Wright, Thomas E. 2026. Mastering New Testament Exegesis & Pauline Greek Syntax. Phoenix, AZ: BIBU Media Press.',
    citationHarvard: 'Wright, T.E., 2026. Mastering New Testament Exegesis & Pauline Greek Syntax. Phoenix, AZ: BIBU Media Press.'
  },

  // 9. MULTIMEDIA EXPANSION: AUDIO COURSES & AUDIOBOOKS
  {
    id: 'lib-res-media-002',
    title: 'Systematic Theology Audio Masterclass: Prolegomena & the Doctrine of God',
    author: 'Dr. Jonathan Vance, Th.D. & Rev. Dr. Robert Lindqvist',
    publisher: 'BIBU Audio Scholastic Series (Phoenix, AZ)',
    category: 'Theology',
    collectionCategory: 'Systematic Theology',
    resourceType: 'Audio Course',
    format: 'Audio Course',
    pagesOrDuration: '4 Modules (8 Audio Lessons • 4h 30m)',
    year: 2026,
    academicLevel: 'Master',
    language: 'English',
    scriptureReferences: ['Genesis 1:1', 'Deuteronomy 6:4', 'Exodus 3:14', 'John 1:1-18', 'Romans 11:33-36'],
    keywords: ['Systematic Theology', 'Doctrine of God', 'Audio Course', 'Trinity', 'Inerrancy', 'Theology Proper'],
    isbnOrDoi: 'BIBU-AUD-2026-THEO-02',
    peerReviewed: true,
    licenseType: 'BIBU Institutional License',
    licenseClassification: 'Faculty-created',
    downloadAllowed: true,
    isPopular: true,
    isFeatured: true,
    isRecommended: true,
    coverColor: 'bg-[#002366]',
    assignedCourseCodes: ['THE-201', 'HER-301'],
    audioUrl: 'https://cdn.bibu.edu/media/audio/systematic_theology_mod1.mp3',
    audioDurationSeconds: 16200,
    completionThresholdPercent: 90,
    description: 'Immerse yourself in exhaustive lectures on the Triune God, divine simplicity, aseity, providence, and the inerrancy of Scripture, recorded with crystal-clear academic narration.',
    abstract: 'Co-taught by Dr. Jonathan Vance and Rev. Dr. Robert Lindqvist, this comprehensive audio course provides seminary students with doctrinal clarity and synchronized read-along study texts.',
    audioChapters: [
      {
        id: 'achap-1',
        chapterNumber: 1,
        title: 'Chapter 1: The Epistemological Necessity of Divine Revelation',
        duration: '24:18',
        durationSeconds: 1458,
        audioUrl: 'https://cdn.bibu.edu/media/audio/systheo_chap1.mp3',
        description: 'Why human reason cannot know God truly apart from His self-disclosure in Holy Scripture.',
        transcript: [
          {
            id: 'at-1',
            timestampSeconds: 0,
            formattedTimestamp: '00:00',
            speaker: 'Dr. Jonathan Vance',
            text: 'Welcome to Chapter 1 of the Systematic Theology Masterclass at Breakthrough International Bible University.'
          },
          {
            id: 'at-2',
            timestampSeconds: 30,
            formattedTimestamp: '00:30',
            speaker: 'Dr. Jonathan Vance',
            text: 'We begin with Prolegomena—the preliminary principles of theological science. How does finite man come to know the infinite and holy God?'
          },
          {
            id: 'at-3',
            timestampSeconds: 90,
            formattedTimestamp: '01:30',
            speaker: 'Dr. Jonathan Vance',
            text: 'Scripture affirms that God has not remained silent. He has spoken propositionally and infallibly through His prophets, apostles, and supremely in His Son Jesus Christ.',
            scriptureRef: 'Hebrews 1:1-2'
          }
        ]
      },
      {
        id: 'achap-2',
        chapterNumber: 2,
        title: 'Chapter 2: Theology Proper & the Triune Nature of God',
        duration: '32:45',
        durationSeconds: 1965,
        audioUrl: 'https://cdn.bibu.edu/media/audio/systheo_chap2.mp3',
        description: 'Exposition of the Nicene-Constantinopolitan Trinitarian framework: One Divine Essence in Three Co-equal Persons.',
        transcript: [
          {
            id: 'at-4',
            timestampSeconds: 0,
            formattedTimestamp: '00:00',
            speaker: 'Rev. Dr. Robert Lindqvist',
            text: 'In Chapter 2, we contemplate Theology Proper: the holy attributes, aseity, and eternal triune fellowship of Father, Son, and Holy Spirit.'
          }
        ]
      }
    ],
    synchronizedParagraphs: [
      {
        id: 'sp-1',
        paragraphNumber: 1,
        timestampStartSeconds: 0,
        timestampEndSeconds: 28,
        text: 'Christian theological inquiry does not begin with autonomous human philosophy, but with the humble reception of God’s self-attesting Word (theopneustos).'
      },
      {
        id: 'sp-2',
        paragraphNumber: 2,
        timestampStartSeconds: 29,
        timestampEndSeconds: 88,
        text: 'The doctrine of God governs every other locus of systematic theology. Because God is immutable, sovereign, and holy, His redemptive decrees remain unshakable.'
      },
      {
        id: 'sp-3',
        paragraphNumber: 3,
        timestampStartSeconds: 89,
        timestampEndSeconds: 160,
        text: 'In Christ, the fullness of deity dwells bodily (Colossians 2:9). Systematic theology connects the eternal counsel of God with active Christian discipleship.'
      }
    ],
    citationApa: 'Vance, J., & Lindqvist, R. (2026). Systematic Theology Audio Masterclass. BIBU Audio Press.',
    citationMla: 'Vance, Jonathan, and Robert Lindqvist. Systematic Theology Audio Masterclass. BIBU Audio Press, 2026.',
    citationChicago: 'Vance, Jonathan, and Robert Lindqvist. 2026. Systematic Theology Audio Masterclass. Phoenix, AZ: BIBU Audio Press.',
    citationHarvard: 'Vance, J. and Lindqvist, R., 2026. Systematic Theology Audio Masterclass. Phoenix, AZ: BIBU Audio Press.'
  },

  // 10. MULTIMEDIA EXPANSION: VIDEO BOOK
  {
    id: 'lib-res-media-003',
    title: 'The Visual Hermeneutics Treatise: Slide-Annotated Video Monograph',
    author: 'Dr. Thomas E. Wright, Ph.D. & Academic Media Team',
    publisher: 'BIBU Media Publications',
    category: 'Biblical Studies',
    collectionCategory: 'Bible Studies',
    resourceType: 'Video Book',
    format: 'Video Book',
    pagesOrDuration: '1 Visual Video Book (1h 45m)',
    year: 2026,
    academicLevel: 'Bachelor',
    language: 'English',
    scriptureReferences: ['Nehemiah 8:8', '2 Timothy 2:15', '2 Peter 1:20-21'],
    keywords: ['Hermeneutics', 'Video Book', 'Slide Presentation', 'Exegesis', 'Visual Learning'],
    isbnOrDoi: 'BIBU-VBOOK-2026-03',
    peerReviewed: true,
    licenseType: 'BIBU Institutional License',
    licenseClassification: 'BIBU-owned',
    downloadAllowed: true,
    isPopular: true,
    isFeatured: true,
    coverColor: 'bg-[#002366]',
    assignedCourseCodes: ['HER-301'],
    videoUrl: 'https://cdn.bibu.edu/media/video/visual_hermeneutics.mp4',
    videoDurationSeconds: 6300,
    completionThresholdPercent: 90,
    description: 'A rich visual book integrating synchronized text slides, theological charts, Greek syntactic diagrams, and voiceover exposition.',
    abstract: 'Engineered for students who learn best through visual synthesis and diagrammatic breakdowns of biblical texts.',
    citationApa: 'Wright, T. E. (2026). The Visual Hermeneutics Treatise. BIBU Media Publications.',
    citationMla: 'Wright, Thomas E. The Visual Hermeneutics Treatise. BIBU Media Publications, 2026.',
    citationChicago: 'Wright, Thomas E. 2026. The Visual Hermeneutics Treatise. Phoenix, AZ: BIBU Media Publications.',
    citationHarvard: 'Wright, T.E., 2026. The Visual Hermeneutics Treatise. Phoenix, AZ: BIBU Media Publications.'
  },

  // 11. MULTIMEDIA EXPANSION: AUDIOBOOK
  {
    id: 'lib-res-media-004',
    title: 'The Reformed Pastor: Annotated Institutional Audio Edition',
    author: 'Richard Baxter (Annotated with modern pastoral insights by Dr. Michael C. Sterling)',
    publisher: 'BIBU Heritage Audio Library',
    category: 'Leadership',
    collectionCategory: 'Pastoral Ministry',
    resourceType: 'Audio Book',
    format: 'Audio Book',
    pagesOrDuration: '6 Audio Chapters (8h 15m)',
    year: 2025,
    academicLevel: 'All',
    language: 'English',
    scriptureReferences: ['Acts 20:28', '1 Peter 5:1-4', '1 Timothy 4:16'],
    keywords: ['Pastoral Ministry', 'Audiobook', 'Classic Theology', 'Shepherding', 'Personal Holiness'],
    isbnOrDoi: 'BIBU-ABOOK-2025-04',
    peerReviewed: true,
    licenseType: 'Public Domain & Academic Commentary',
    licenseClassification: 'Public domain',
    downloadAllowed: true,
    isPopular: true,
    isFeatured: true,
    coverColor: 'bg-[#14532D]',
    assignedCourseCodes: ['PAS-401'],
    audioUrl: 'https://cdn.bibu.edu/media/audio/reformed_pastor_full.mp3',
    audioDurationSeconds: 29700,
    completionThresholdPercent: 90,
    description: 'The monumental classic on pastoral care, personal godliness, and the oversight of souls, newly narrated with academic commentaries for modern theological interns.',
    abstract: 'Baxter’s urgent call to pastoral faithfulness in Acts 20:28: Take heed therefore unto yourselves, and to all the flock over which the Holy Ghost hath made you overseers.',
    audioChapters: [
      {
        id: 'ab-chap-1',
        chapterNumber: 1,
        title: 'Chapter 1: The Pastor’s Personal Walk with God',
        duration: '45:00',
        durationSeconds: 2700,
        audioUrl: 'https://cdn.bibu.edu/media/audio/baxter_chap1.mp3',
        description: 'Exhortations on keeping a clear conscience and mortifying sin in the minister’s private life.'
      },
      {
        id: 'ab-chap-2',
        chapterNumber: 2,
        title: 'Chapter 2: The Nature and Pastoral Care of the Flock',
        duration: '52:10',
        durationSeconds: 3130,
        audioUrl: 'https://cdn.bibu.edu/media/audio/baxter_chap2.mp3',
        description: 'Knowing each sheep by name and catechizing families in the home.'
      }
    ],
    citationApa: 'Baxter, R., & Sterling, M. C. (2025). The Reformed Pastor: Annotated Audio Edition. BIBU Heritage Audio.',
    citationMla: 'Baxter, Richard, and Michael C. Sterling. The Reformed Pastor: Annotated Audio Edition. BIBU Heritage Audio, 2025.',
    citationChicago: 'Baxter, Richard, and Michael C. Sterling. 2025. The Reformed Pastor: Annotated Audio Edition. Phoenix, AZ: BIBU Heritage Audio.',
    citationHarvard: 'Baxter, R. and Sterling, M.C., 2025. The Reformed Pastor. Phoenix, AZ: BIBU Heritage Audio.'
  }
];

// INSTITUTIONAL PASTORAL PROTOCOLS DATASET
export const INSTITUTIONAL_PASTORAL_PROTOCOLS: PastoralProtocol[] = [
  {
    id: 'prot-hosp-001',
    code: 'BIBU-PROT-CARE-01',
    title: 'Hospital & Intensive Care Unit (ICU) Pastoral Visitation Protocol',
    category: 'Pastoral Care',
    targetAudience: 'Ordained Pastors, Hospital Chaplains, Pastoral Care Teams',
    version: '4.2 (2026 Revision)',
    lastReviewed: 'January 2026',
    authoritativeBody: 'BIBU Department of Pastoral Theology & Clinical Pastoral Care',
    purpose: 'To provide ministers with structured, compassionate, and legally compliant guidelines when ministering to hospitalized individuals, families in intensive care, and terminally ill congregants.',
    scope: 'Applies to all university-affiliated pastors, student interns, chaplains, and local church elders performing acute institutional medical visits.',
    theologicalFoundation: 'Scripture commands the church to visit the sick and pray in the authority of the Lord Jesus Christ (James 5:14-15; Matthew 25:36). Pastoral presence embodies the incarnate mercy and comfort of God (2 Cor. 1:3-4).',
    scripturePassages: ['James 5:14-16', 'Matthew 25:36', 'Psalm 23:1-6', '2 Corinthians 1:3-5', 'Romans 8:38-39'],
    keyDefinitions: [
      { term: 'Clinical Pastoral Care', definition: 'The professional, prayerful application of spiritual guidance, comfort, and presence within healthcare institutions.' },
      { term: 'Aseptic Boundary Protocols', definition: 'Strict adherence to medical hygiene, sanitization, protective equipment (PPE), and patient confidentiality regulations (HIPAA/GDPR).' },
      { term: 'Anointing with Oil', definition: 'The biblical ordinance of applying consecrated oil accompanied by prayer of faith for divine healing and comfort (James 5:14).' }
    ],
    keyResponsibilities: [
      { role: 'Lead Minister / Chaplain', responsibility: 'Liaise with hospital nursing staff, obtain patient/family consent, deliver concise prayer and Scripture ministry.' },
      { role: 'Pastoral Care Intern', responsibility: 'Accompany senior clergy, maintain visitation logs, provide non-intrusive support to family in waiting areas.' },
      { role: 'Local Church Office', responsibility: 'Record emergency hospital admission dates, coordinate follow-up home meals, maintain prayer network.' }
    ],
    stepByStepProcedure: [
      {
        stepNumber: 1,
        title: 'Pre-Visit Consultation & Authorization',
        description: 'Verify patient room status with family or hospital reception. Contact nursing station upon arrival to ensure patient is alert and not undergoing medical procedures.',
        criticalNotes: 'Never enter during active medical resuscitation, doctor examinations, or private hygiene care.'
      },
      {
        stepNumber: 2,
        title: 'Hygiene & Clinical Preparation',
        description: 'Sanitize hands thoroughly before entering. Don required masks/gloves if the room is designated for isolation or immunosuppressed patients.',
        criticalNotes: 'Do not touch medical drips, ventilator monitors, or catheter equipment under any circumstances.'
      },
      {
        stepNumber: 3,
        title: 'Bedside Pastoral Interaction (Duration: 5–15 Minutes)',
        description: 'Speak in calm, gentle tones. Read a comforting short passage (e.g. Psalm 23, Romans 8:31-39). Offer heartfelt, succinct prayer asking for God\'s peace and healing.',
        criticalNotes: 'Sick patients exhaust rapidly. Do not turn a pastoral visit into an extended theological discourse.'
      },
      {
        stepNumber: 4,
        title: 'Ordinance of Anointing (Where Requested)',
        description: 'With patient and family consent, place a small drop of oil on the forehead and offer the prayer of faith in accordance with James 5:14.',
        criticalNotes: 'Check with nursing staff if patient has severe dermal sensitivities or head trauma.'
      },
      {
        stepNumber: 5,
        title: 'Family Comfort & Departure',
        description: 'Briefly encourage family members present in the room. Provide chaplain contact card and quietly depart, leaving the patient to rest.'
      }
    ],
    ethicalConsiderations: [
      'Absolute confidentiality regarding patient medical condition; do not disclose diagnoses on social media or in general church prayer requests without explicit written consent.',
      'Respect patient autonomy regarding end-of-life directives and DNR (Do Not Resuscitate) orders.',
      'Never offer unsolicited medical advice or recommend discontinuing prescribed clinical treatment.'
    ],
    safeguardingNotes: 'When visiting pediatric or minor patients, at least one parent, legal guardian, or certified healthcare professional must remain in the room throughout the entire pastoral session.',
    documentationRequirements: [
      'Log date, arrival/departure time, patient name, hospital room number in secure pastoral record.',
      'Record specific spiritual requests for senior pastoral follow-up.'
    ],
    mandatoryReferralThresholds: [
      'Patient exhibits acute psychiatric psychosis, severe suicidal ideation, or clinical delirium -> Immediately alert charge nurse and hospital psychiatric chaplain.',
      'Suspicion of elder abuse or domestic assault -> Mandatory statutory report to hospital social services.'
    ],
    downloadFileName: 'BIBU_Pastoral_Protocol_Hospital_ICU_Visitation.pdf'
  },
  {
    id: 'prot-bereave-002',
    code: 'BIBU-PROT-CARE-02',
    title: 'Bereavement, Grief Support & Christian Funeral Service Protocol',
    category: 'Pastoral Care',
    targetAudience: 'Pastoral Staff, Grief Care Facilitators, Funeral Officiants',
    version: '3.8',
    lastReviewed: 'February 2026',
    authoritativeBody: 'BIBU School of Christian Ministry & Pastoral Counseling Board',
    purpose: 'To establish standard pastoral care procedures for ministering to grieving families immediately following a death, planning the memorial service, and providing structured 12-month bereavement follow-up.',
    scope: 'All funeral services, memorial liturgies, and graveside committals conducted by BIBU faculty, students, and affiliated church ministers.',
    theologicalFoundation: 'Christians mourn, but not as those who have no hope, because of the bodily resurrection of our Lord Jesus Christ (1 Thessalonians 4:13-18; John 11:25-26; 1 Corinthians 15:51-57).',
    scripturePassages: ['1 Thessalonians 4:13-18', 'John 11:25-27', 'Psalm 34:18', '1 Corinthians 15:51-58', 'Revelation 21:1-4'],
    keyDefinitions: [
      { term: 'Eulogy vs. Homily', definition: 'Eulogy is family remembrance honoring the deceased; the Funeral Homily is the pastoral proclamation of the Resurrection of Jesus Christ and the hope of eternal life.' },
      { term: 'Committed to Earth (Committal)', definition: 'The sacred graveside liturgical committal of the physical body awaiting the final resurrection.' }
    ],
    keyResponsibilities: [
      { role: 'Officiating Pastor', responsibility: 'Conduct initial family bereavement consultation, coordinate order of service, deliver gospel-centered resurrection homily.' },
      { role: 'Grief Care Coordinator', responsibility: 'Ensure family hospitality during funeral reception and establish 30-day, 90-day, and 1-year bereavement follow-up visits.' }
    ],
    stepByStepProcedure: [
      {
        stepNumber: 1,
        title: 'Immediate Crisis Response (Within 4–12 Hours)',
        description: 'Visit the grieving family home or hospital. Offer quiet, listening presence, Scripture comfort, and prayer. Do not offer theological cliches.',
        criticalNotes: 'Avoid phrases like "God needed another angel" or "Everything happens for a reason". Speak of God’s nearness to the brokenhearted (Psalm 34:18).'
      },
      {
        stepNumber: 2,
        title: 'Funeral Planning & Order of Service Consultation',
        description: 'Meet with primary family leaders to review hymn selections, eulogy speakers, Scripture readers, and logistics with the funeral director.',
        criticalNotes: 'Maintain order: maximum 2 eulogy speakers of 3 minutes each to prevent emotional exhaustion of the congregation.'
      },
      {
        stepNumber: 3,
        title: 'Execution of the Christian Memorial Liturgy',
        description: 'Proclaim Christ’s victory over death and grave. Deliver a clear, compassionate presentation of the gospel and eternal salvation in Christ.'
      },
      {
        stepNumber: 4,
        title: 'Graveside Committal Service',
        description: 'Lead the final prayers at the burial site or columbarium, concluding with the apostolic benediction (Numbers 6:24-26; 2 Cor. 13:14).'
      },
      {
        stepNumber: 5,
        title: 'Long-Term Grief Shepherding',
        description: 'Enroll primary surviving spouse or parents in the church’s 12-week GriefShare or pastoral counseling cohort.'
      }
    ],
    ethicalConsiderations: [
      'Honor family wishes regarding service structure while maintaining the uncompromised Christian integrity of the sanctuary.',
      'Refuse honorariums if the bereaved family is experiencing severe financial hardship.'
    ],
    safeguardingNotes: 'Ensure children and adolescents in the family receive age-appropriate pastoral grief counseling and parental support.',
    documentationRequirements: [
      'File official funeral record with Church Registry (Full name of deceased, date of death, officiant, burial location).'
    ],
    mandatoryReferralThresholds: [
      'Family member exhibits signs of complicated grief disorder, prolonged clinical depression, or active suicide threats -> Immediate referral to licensed Christian psychologist.'
    ],
    downloadFileName: 'BIBU_Pastoral_Protocol_Bereavement_Funeral_Manual.pdf'
  },
  {
    id: 'prot-safeguard-003',
    code: 'BIBU-PROT-SAFE-01',
    title: 'Child, Minor & Vulnerable Adult Safeguarding & Protection Policy',
    category: 'Safeguarding & Protection',
    targetAudience: 'All University Faculty, Pastors, Sunday School Directors, Youth Pastors',
    version: '5.0 (Mandatory Compliance)',
    lastReviewed: 'January 2026',
    authoritativeBody: 'BIBU Institutional Integrity, Legal Compliance & Safeguarding Directorate',
    purpose: 'Zero-tolerance policy establishing rigorous screening, operational supervision, background checks, and reporting mechanisms to protect children, youth, and vulnerable adults from physical, emotional, or sexual abuse.',
    scope: 'All campus programs, church children’s ministries, youth retreats, orphanages, mission trips, and counseling offices operated by BIBU members.',
    theologicalFoundation: 'Children are a sacred heritage from the Lord (Psalm 127:3). Jesus issued the sternest warnings against anyone causing a child to stumble (Matthew 18:6, Mark 10:14).',
    scripturePassages: ['Matthew 18:5-10', 'Mark 10:13-16', 'Proverbs 31:8-9', 'Psalm 82:3-4'],
    keyDefinitions: [
      { term: 'Two-Adult Rule', definition: 'Mandatory operational requirement that at least two screened, unrelated adult leaders must be present in any room or vehicle with minors at all times.' },
      { term: 'Mandated Reporter', definition: 'Under law and ecclesiastical canon, all pastors, teachers, and staff are legally and spiritually required to report suspected abuse immediately.' }
    ],
    keyResponsibilities: [
      { role: 'Safeguarding Officer', responsibility: 'Process national criminal background checks (FBI / Police Clearance), maintain staff certification records, investigate incidents.' },
      { role: 'Ministry Leaders & Teachers', responsibility: 'Enforce bathroom escort protocols, open-door classroom policies, and immediate incident documentation.' }
    ],
    stepByStepProcedure: [
      {
        stepNumber: 1,
        title: 'Mandatory Screening & Vetting Protocol',
        description: 'All volunteers and staff must undergo 6-month church membership tenure, written application, 3 pastoral reference checks, and nationwide background check.',
        criticalNotes: 'No individual with any history of violent or sexual offenses against minors may serve in youth or children’s ministries.'
      },
      {
        stepNumber: 2,
        title: 'Classroom & Facility Physical Security',
        description: 'All classrooms must have interior observation windows or open doors. Check-in/check-out barcode system required for all children under age 12.'
      },
      {
        stepNumber: 3,
        title: 'Immediate Protocol upon Disclosure or Suspicion of Abuse',
        description: '1. Ensure minor’s immediate physical safety. 2. Do not interrogate or cross-examine child. 3. Immediately report to Civil Child Protection Services and local police. 4. Notify Senior Pastor and University Safeguarding Directorate.'
      }
    ],
    ethicalConsiderations: [
      'Civil legal reporting laws supersede ecclesiastical secrecy; spiritual confidentiality does not protect perpetrators of child abuse.',
      'Provide immediate trauma support and pastoral counseling to victims and families.'
    ],
    safeguardingNotes: 'All electronic communication with youth (WhatsApp, SMS, Zoom) must include parents on the thread or group.',
    documentationRequirements: [
      'Complete BIBU Form SF-101 (Incident Reporting Document) within 2 hours of any reported event.'
    ],
    mandatoryReferralThresholds: [
      'ANY reasonable suspicion of child neglect, physical abuse, or sexual misconduct -> Instant statutory notification to law enforcement within 24 hours.'
    ],
    downloadFileName: 'BIBU_Institutional_Child_Safeguarding_Policy_2026.pdf'
  },
  {
    id: 'prot-marriage-004',
    code: 'BIBU-PROT-ORD-01',
    title: 'Christian Holy Matrimony & Premarital Pastoral Counseling Protocol',
    category: 'Sacraments & Ordinances',
    targetAudience: 'Licensed Ministers, Marriage Counselors, Elders',
    version: '3.4',
    lastReviewed: 'January 2026',
    authoritativeBody: 'BIBU Board of Ministerial Ethics & Family Life Studies',
    purpose: 'To ensure biblical, legal, and relational preparation for couples entering sacred covenantal marriage.',
    scope: 'All weddings officiated in BIBU chapels or by university-credentialed clergy.',
    theologicalFoundation: 'Marriage is a sacred covenant instituted by God between one man and one woman, symbolizing the mystical union between Christ and His holy Church (Genesis 2:24; Ephesians 5:22-33; Matthew 19:4-6).',
    scripturePassages: ['Genesis 2:18-25', 'Ephesians 5:21-33', 'Matthew 19:3-9', 'Hebrews 13:4', '1 Corinthians 13:1-13'],
    keyDefinitions: [
      { term: 'Covenant Marriage', definition: 'A lifelong, exclusive, sacred spiritual union before God and witnesses, binding until physical death.' },
      { term: 'Premarital Diagnostic Assessment', definition: 'Structured 8-week relational analysis covering communication, financial stewardship, in-law boundaries, conflict resolution, and sexual intimacy.' }
    ],
    keyResponsibilities: [
      { role: 'Officiating Pastor', responsibility: 'Conduct minimum 6 premarital counseling sessions, verify civil marriage license validity, lead rehearsal and ceremony.' }
    ],
    stepByStepProcedure: [
      {
        stepNumber: 1,
        title: 'Initial Pastoral Intake & Spiritual Compatibility (6 Months Prior)',
        description: 'Verify both partners’ shared faith in Jesus Christ (2 Cor. 6:14), freedom from existing marital bonds, and parental/family blessing.'
      },
      {
        stepNumber: 2,
        title: 'Structured 6-Session Premarital Curriculum',
        description: 'Session 1: Biblical Covenant & Roles; Session 2: Communication & Conflict Resolution; Session 3: Financial Management & Budgeting; Session 4: In-Laws & Family Systems; Session 5: Intimacy & Purity; Session 6: Ceremony Planning & Vows.'
      },
      {
        stepNumber: 3,
        title: 'Civil License Verification',
        description: 'Inspect valid county/state marriage license 48 hours prior to ceremony. Officiant must sign and return to civil recorder within statutory deadline.'
      }
    ],
    ethicalConsiderations: [
      'The minister retains pastoral prerogative to decline officiating if either party exhibits severe unaddressed domestic abuse, active substance addiction, or coercion.'
    ],
    safeguardingNotes: 'Couples must be of legal age under civil law.',
    documentationRequirements: [
      'File signed church marriage registry with certificate copy.',
      'Submit civil marriage return to municipal court.'
    ],
    mandatoryReferralThresholds: [
      'Evidence of domestic violence, coercive control, or severe psychopathology -> Suspend wedding proceedings and refer to specialized counseling.'
    ],
    downloadFileName: 'BIBU_Premarital_Counseling_Liturgical_Manual.pdf'
  }
];

// GREEK & HEBREW BIBLICAL WORD STUDY LEXICON DATASET
export const BIBLICAL_WORD_STUDIES: BiblicalWordEntry[] = [
  {
    id: 'word-g26',
    strongsNumber: 'G26',
    originalWord: 'ἀγάπη',
    transliteration: 'agapē',
    language: 'Greek',
    partOfSpeech: 'Noun, Feminine',
    pronunciation: 'ah-GAH-pay',
    rootWord: 'ἀγαπάω (G25 - agapaō)',
    shortDefinition: 'Self-sacrificial, unconditional, divine love; benevolent goodwill.',
    theologicalSignificance: 'Unlike eros (romantic desire), philia (friendship/brotherly affection), or storgē (familial bond), agapē describes the sovereign, unconditional love of God demonstrated supreme at Calvary (Rom. 5:8; 1 John 4:8-10). It is a deliberate choice of will to seek the eternal good of the other regardless of personal cost.',
    occurrenceCount: 116,
    testament: 'New Testament',
    keyPassages: [
      {
        verse: '1 Corinthians 13:4-7',
        excerpt: 'Ἡ ἀγάπη μακροθυμεῖ, χρηστεύεται ἡ ἀγάπη...',
        context: 'Paul’s majestic definition of love as patient, kind, not envious, and enduring all things.'
      },
      {
        verse: 'Romans 5:8',
        excerpt: 'συνίστησιν δὲ τὴν ἑαυτοῦ ἀγάπην εἰς ἡμᾶς ὁ θεός...',
        context: 'God demonstrates His own agapē for us in that while we were still sinners, Christ died for us.'
      },
      {
        verse: '1 John 4:8',
        excerpt: 'ὁ μὴ ἀγαπῶν οὐκ ἔγνω τὸν θεόν, ὅτι ὁ θεὸς ἀγάπη ἐστίν.',
        context: 'He who does not love does not know God, for God is love.'
      }
    ],
    semanticNuances: [
      'Divine covenantal love initiated by God toward sinners',
      'The primary fruit of the indwelling Holy Spirit (Gal. 5:22)',
      'The supreme badge of true Christian discipleship (John 13:35)',
      'The eternal virtue outlasting spiritual gifts (1 Cor. 13:13)'
    ],
    relatedStrongs: ['G25 (agapaō)', 'G27 (agapētos)', 'G5368 (phileō)', 'G5485 (charis)'],
    scholarlyNotes: 'In Classical Greek, agapē was rare and colorless; in the Septuagint and New Testament, the Holy Spirit elevated this term to express the unique, self-giving, covenantal heart of God revealed in the Incarnation and Cross.'
  },
  {
    id: 'word-g3056',
    strongsNumber: 'G3056',
    originalWord: 'λόγος',
    transliteration: 'logos',
    language: 'Greek',
    partOfSpeech: 'Noun, Masculine',
    pronunciation: 'LAH-gahss',
    rootWord: 'λέγω (G3004 - legō, to speak)',
    shortDefinition: 'Word, speech, divine reason, message, the Second Person of the Trinity.',
    theologicalSignificance: 'In the Johannine literature (John 1:1, 1:14; 1 John 1:1; Rev. 19:13), Logos designates Jesus Christ as the eternal, uncreated self-expression of the Father, co-equal and co-eternal with God, through whom all creation was framed.',
    occurrenceCount: 330,
    testament: 'New Testament',
    keyPassages: [
      {
        verse: 'John 1:1',
        excerpt: 'Ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν θεόν, καὶ θεὸς ἦν ὁ λόγος.',
        context: 'In the beginning was the Word, and the Word was with God, and the Word was God.'
      },
      {
        verse: 'John 1:14',
        excerpt: 'Καὶ ὁ λόγος σὰρξ ἐγένετο καὶ ἐσκήνωσεν ἐν ἡμῖν...',
        context: 'And the Word became flesh and tabernacled among us, full of grace and truth.'
      },
      {
        verse: 'Hebrews 4:12',
        excerpt: 'Ζῶν γὰρ ὁ λόγος τοῦ θεοῦ καὶ ἐνεργὴς...',
        context: 'For the Word of God is living and active, sharper than any two-edged sword.'
      }
    ],
    semanticNuances: [
      'The pre-existent, divine Person of the Son (John 1:1)',
      'The spoken message of the Gospel (Mark 4:14; Rom. 10:17)',
      'The written Scriptures / divine revelation (2 Tim. 4:2)',
      'Rational discourse, statement, or account (Matt. 12:36)'
    ],
    relatedStrongs: ['G4487 (rhēma)', 'G3004 (legō)', 'G3051 (logion)'],
    scholarlyNotes: 'John does not derive Logos primarily from Philo’s impersonal Platonic principle, but from the Old Testament Dabar Yahweh (the creative, prophetic Word of the Lord) combined with Proverbs 8 divine Wisdom.'
  },
  {
    id: 'word-g4102',
    strongsNumber: 'G4102',
    originalWord: 'πίστις',
    transliteration: 'pistis',
    language: 'Greek',
    partOfSpeech: 'Noun, Feminine',
    pronunciation: 'PEES-tees',
    rootWord: 'πείθω (G3982 - peithō, to persuade)',
    shortDefinition: 'Faith, belief, trust, conviction, fidelity, the body of Christian truth.',
    theologicalSignificance: 'Pistis is the sole instrument of justification before a holy God (Rom. 3:28, 5:1; Eph. 2:8). It is not mere intellectual assent (notitia/assensus), but personal trust, surrender, and reliance (fiducia) upon the Person and finished work of Jesus Christ.',
    occurrenceCount: 243,
    testament: 'New Testament',
    keyPassages: [
      {
        verse: 'Ephesians 2:8-9',
        excerpt: 'τῇ γὰρ χάριτί ἐστε σεσῳσμένοι διὰ πίστεως...',
        context: 'For by grace you have been saved through faith; and that not of yourselves, it is the gift of God.'
      },
      {
        verse: 'Hebrews 11:1',
        excerpt: 'Ἔστιν δὲ πίστις ἐλπιζομένων ὑπόστασις, πραγμάτων ἔλεγχος οὐ βλεπομένων.',
        context: 'Now faith is the assurance of things hoped for, the conviction of things not seen.'
      },
      {
        verse: 'Romans 1:17',
        excerpt: 'ὁ δὲ δίκαιος ἐκ πίστεως ζήσεται.',
        context: 'The righteous shall live by faith (quoting Habakkuk 2:4).'
      }
    ],
    semanticNuances: [
      'Subjective saving trust in Christ for eternal life',
      'Objective doctrine: "the faith once delivered to the saints" (Jude 1:3)',
      'Faithfulness, loyalty, and integrity in moral duty (Matt. 23:23)',
      'A supernatural spiritual gift of the Holy Spirit (1 Cor. 12:9)'
    ],
    relatedStrongs: ['G4100 (pisteuō - to believe)', 'G4103 (pistos - faithful)', 'G567 (apistia - unbelief)'],
    scholarlyNotes: 'Paul emphasizes pistis as receiving grace without human works of merit; James emphasizes that genuine saving pistis inevitably produces visible works of holiness.'
  },
  {
    id: 'word-g5485',
    strongsNumber: 'G5485',
    originalWord: 'χάρις',
    transliteration: 'charis',
    language: 'Greek',
    partOfSpeech: 'Noun, Feminine',
    pronunciation: 'KHAH-rees',
    rootWord: 'χαίρω (G5463 - chairō, to rejoice)',
    shortDefinition: 'Grace, unmerited favor, divine enablement, benevolent gift.',
    theologicalSignificance: 'Charis signifies God’s free, unearned, unconditional favor bestowed upon guilty, undeserving sinners through Jesus Christ. It is the basis of election, justification, regeneration, and sanctification.',
    occurrenceCount: 155,
    testament: 'New Testament',
    keyPassages: [
      {
        verse: 'Titus 2:11',
        excerpt: 'Ἐπεφάνη γὰρ ἡ χάρις τοῦ θεοῦ σωτήριος πᾶσιν ἀνθρώποις...',
        context: 'For the grace of God has appeared, bringing salvation for all people.'
      },
      {
        verse: '2 Corinthians 12:9',
        excerpt: 'Ἀρκεῖ σοι ἡ χάρις μου· ἡ γὰρ δύναμις ἐν ἀσθενείᾳ τελεῖται.',
        context: 'My grace is sufficient for you, for my power is made perfect in weakness.'
      }
    ],
    semanticNuances: [
      'Saving grace delivering from condemnation',
      'Sustaining grace empowering during persecution/suffering',
      'Gratitude and thanksgiving (1 Cor. 10:30)'
    ],
    relatedStrongs: ['G5486 (charisma - spiritual gift)', 'G5483 (charizomai - to forgive freely)'],
    scholarlyNotes: 'In Greco-Roman patronage systems, charis was a reciprocal gift; in New Testament theology, God’s charis is entirely unilateral and unconditioned by recipient worthiness.'
  },
  {
    id: 'word-h7307',
    strongsNumber: 'H7307',
    originalWord: 'רוּחַ',
    transliteration: 'ruach',
    language: 'Hebrew',
    partOfSpeech: 'Noun, Feminine/Masculine',
    pronunciation: 'ROO-akh',
    rootWord: 'Primary word',
    shortDefinition: 'Wind, breath, mind, spirit, the Holy Spirit (Ruach HaKodesh).',
    theologicalSignificance: 'Ruach denotes the invisible, dynamic, life-giving power of God. From the primordial hovering over creation (Gen. 1:2) to the breath of life in humanity (Gen. 2:7) and the eschatological outpouring upon all flesh (Joel 2:28), Ruach is the personal presence and agent of God.',
    occurrenceCount: 378,
    testament: 'Old Testament',
    keyPassages: [
      {
        verse: 'Genesis 1:2',
        excerpt: 'וְרוּחַ אֱלֹהִים מְרַחֶפֶת עַל־פְּנֵי הַמָּיִם',
        context: 'And the Spirit of God was hovering over the face of the waters.'
      },
      {
        verse: 'Ezekiel 37:9',
        excerpt: 'מֵאַרְבַּע רוּחוֹת בֹּאִי הָרוּחַ וּפְחִי בַּהֲרוּגִים הָאֵלֶּה...',
        context: 'Come from the four winds, O breath, and breathe on these slain that they may live (Valley of Dry Bones).'
      },
      {
        verse: 'Zechariah 4:6',
        excerpt: 'לֹא בְחַיִל וְלֹא בְכֹחַ כִּי אִם־בְּרוּחִי אָמַר יְהוָה צְבָאוֹת',
        context: 'Not by might nor by power, but by my Spirit, says the LORD of hosts.'
      }
    ],
    semanticNuances: [
      'The Holy Spirit of God empowering prophets, judges, kings, and artisans',
      'Physical breath/wind demonstrating divine sovereignty',
      'The human spirit / inner disposition (Psalm 51:10)'
    ],
    relatedStrongs: ['H5397 (neshamah - breath)', 'H6944 (qodesh - holy)'],
    scholarlyNotes: 'The Greek equivalent pneuma (G4151) retains the same triad of meanings (wind, breath, spirit), linking Old Testament pneumatology to Pentecost.'
  },
  {
    id: 'word-h2617',
    strongsNumber: 'H2617',
    originalWord: 'חֶסֶד',
    transliteration: 'chesed (khesed)',
    language: 'Hebrew',
    partOfSpeech: 'Noun, Masculine',
    pronunciation: 'KHEH-sed',
    rootWord: 'Primary root',
    shortDefinition: 'Covenant loyalty, steadfast love, lovingkindness, mercy, unfailing grace.',
    theologicalSignificance: 'Chesed is one of the most sublime theological words in the Old Testament. It describes God’s relentless, unbreakable covenant devotion to His people based on His sworn promises, even when Israel was unfaithful (Exodus 34:6-7; Psalm 136).',
    occurrenceCount: 248,
    testament: 'Old Testament',
    keyPassages: [
      {
        verse: 'Exodus 34:6',
        excerpt: 'יְהוָה יְהוָה אֵל רַחוּם וְחַנּוּן אֶרֶךְ אַפַּיִם וְרַב־חֶסֶד וֶאֱמֶת',
        context: 'The LORD, the LORD, a God merciful and gracious, slow to anger, and abounding in steadfast love (chesed) and faithfulness.'
      },
      {
        verse: 'Lamentations 3:22-23',
        excerpt: 'חַסְדֵי יְהוָה כִּי לֹא־תָמְנוּ כִּי לֹא־כָלוּ רַחֲמָיו...',
        context: 'The steadfast love (chasdei) of the LORD never ceases; his mercies never come to an end; they are new every morning.'
      },
      {
        verse: 'Psalm 136:1',
        excerpt: 'הוֹדוּ לַיהוָה כִּי־טוֹב כִּי לְעוֹלָם חַסְדּוֹ',
        context: 'Give thanks to the LORD, for he is good, for his steadfast love endures forever (repeated 26 times).'
      }
    ],
    semanticNuances: [
      'Unfailing covenant fidelity and grace',
      'Compassion extended to the weak, poor, and helpless',
      'The redemptive foundation of the Davidic covenant (2 Sam. 7)'
    ],
    relatedStrongs: ['H2623 (chasid - godly one / saint)', 'H7356 (racham - tender mercy)'],
    scholarlyNotes: 'The Septuagint translates chesed predominantly as eleos (mercy) and charis (grace), cementing its central role as the OT precursor to Calvary.'
  },
  {
    id: 'word-h7965',
    strongsNumber: 'H7965',
    originalWord: 'שָׁלוֹם',
    transliteration: 'shalom',
    language: 'Hebrew',
    partOfSpeech: 'Noun, Masculine',
    pronunciation: 'shah-LOHM',
    rootWord: 'שָׁלֵם (H7999 - shalem, to be complete/whole)',
    shortDefinition: 'Peace, completeness, wholeness, welfare, health, divine reconciliation.',
    theologicalSignificance: 'Shalom in biblical theology is not merely the absence of war or conflict; it is the positive presence of comprehensive wholeness, cosmic harmony, flourishing, and reconciliation between God and creation through the Prince of Peace (Isaiah 9:6; 53:5).',
    occurrenceCount: 237,
    testament: 'Old Testament',
    keyPassages: [
      {
        verse: 'Numbers 6:24-26',
        excerpt: 'יִשָּׂא יְהוָה פָּנָיו אֵלֶיךָ וְיָשֵׂם לְךָ שָׁלוֹם',
        context: 'The Aaronic Benediction: The LORD lift up his countenance upon you and give you peace (shalom).'
      },
      {
        verse: 'Isaiah 9:6',
        excerpt: 'וַיִּקְרָא שְׁמוֹ פֶּלֶא יוֹעֵץ אֵל גִּבּוֹר אֲבִיעַד שַׂר־שָׁלוֹם',
        context: 'Messianic prophecy: And his name shall be called... Prince of Peace (Sar Shalom).'
      },
      {
        verse: 'Isaiah 53:5',
        excerpt: 'מוּסַר שְׁלוֹמֵנוּ עָלָיו וּבַחֲבֻרָתוֹ נִרְפָּא־לָנוּ',
        context: 'Upon him was the chastisement that brought us peace (musar shelomenu), and with his wounds we are healed.'
      }
    ],
    semanticNuances: [
      'Reconciliation and harmony with God through blood atonement',
      'Relational and communal justice and peace',
      'Physical safety, prosperity, and wellness'
    ],
    relatedStrongs: ['H7999 (shalam - to make restitution / peace)', 'G1515 (eirēnē - peace)'],
    scholarlyNotes: 'Jesus’ greeting "Eirēnē hymin" (Peace be unto you, John 20:19) is the resurrection realization of prophetic Shalom.'
  }
];

// PRE-CONFIGURED FACULTY READING ASSIGNMENTS
export const INITIAL_FACULTY_READING_ASSIGNMENTS: FacultyReadingAssignment[] = [
  {
    id: 'asg-read-001',
    courseId: 'crs-herm-301',
    courseCode: 'HER-301',
    courseTitle: 'Biblical Hermeneutics & Exegetical Method',
    instructorName: 'Dr. Thomas E. Wright, Ph.D.',
    resourceId: 'lib-res-001',
    resourceTitle: 'Grammatical-Historical Exegesis: A Practitioner’s Guide',
    resourceAuthor: 'Dr. Thomas E. Wright',
    requiredPages: 'Pages 1–130 (Chapters 1–3)',
    dueDate: '2026-10-15',
    instructions: 'Complete Chapters 1–3 on Epistemology, Historical Horizon, and Lexical Fallacies. Prepare a 500-word critical evaluation on how word study fallacies (root fallacy, illegitimate totality transfer) distort expository preaching.',
    isRequired: true,
    totalEnrolledStudents: 34,
    completedStudentsCount: 22
  },
  {
    id: 'asg-read-002',
    courseId: 'crs-theo-201',
    courseCode: 'THE-201',
    courseTitle: 'Systematic Theology I: Doctrine of God',
    instructorName: 'Dr. Jonathan Vance, Th.D.',
    resourceId: 'lib-res-003',
    resourceTitle: 'An Exegetical & Theological Commentary on Romans (Chapters 1–8)',
    resourceAuthor: 'Rev. Dr. Robert Lindqvist',
    requiredPages: 'Pages 420–495 (Exposition of Romans 8)',
    dueDate: '2026-10-22',
    instructions: 'Examine the Greek clause structure of Romans 8:1–4. Highlight key terms: katakrima, nomos tou pneumatos, and dikaiōma. Cross-reference with the Council of Nicaea treatise.',
    isRequired: true,
    totalEnrolledStudents: 28,
    completedStudentsCount: 19
  },
  {
    id: 'asg-read-003',
    courseId: 'crs-past-401',
    courseCode: 'PAS-401',
    courseTitle: 'Pastoral Ministry & Expository Homiletics',
    instructorName: 'Rev. Dr. Robert Lindqvist, D.Min.',
    resourceId: 'lib-res-011',
    resourceTitle: 'BIBU Official Pastoral Protocols & Institutional Ministry Manual',
    resourceAuthor: 'BIBU Council of Elders & Legal Advisors',
    requiredPages: 'Pages 1–65 (Hospital Visitation & Bereavement Protocols)',
    dueDate: '2026-10-30',
    instructions: 'Study the mandatory safeguarding rules, ICU entry boundaries, and step-by-step funeral liturgy procedures. Be prepared for practical oral role-play assessment.',
    isRequired: true,
    totalEnrolledStudents: 25,
    completedStudentsCount: 16
  }
];
