export interface StoryboardScene {
  id: string;
  sceneNumber: number;
  timeRange: string;
  startSeconds: number;
  endSeconds: number;
  title: string;
  subtitle: string;
  visuals: string;
  onScreenText: string[];
  wordForWordNarration: string;
  theologicalTerms: string[];
  lecturerVisibilityPercent: number; // e.g. 50-60%
  diagramType: 'opening' | 'definition' | 'why_matters' | 'historical' | 'grammatical' | 'flowchart' | 'philippians' | 'errors' | 'closing';
  notes?: string;
}

export interface MethodStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  prompt: string;
  iconName: string;
  color: string;
  description: string;
  keyQuestions: string[];
}

export const HERMENEUTICS_METHOD_STEPS: MethodStep[] = [
  {
    stepNumber: 1,
    title: 'OBSERVE THE TEXT',
    subtitle: 'Observation',
    prompt: 'What does it say?',
    iconName: 'Eye',
    color: '#002366',
    description: 'Read repeatedly, note repeated words, contrasts, comparisons, verb tenses, and structural connectors.',
    keyQuestions: ['What facts are stated?', 'Who is speaking and to whom?', 'What key verbs and conjunctions are used?']
  },
  {
    stepNumber: 2,
    title: 'EXAMINE THE LANGUAGE',
    subtitle: 'Grammatical Analysis',
    prompt: 'Words, grammar, structure',
    iconName: 'MessageSquare',
    color: '#0D9488',
    description: 'Investigate Hebrew, Aramaic, or Greek vocabulary, syntax, morphology, idioms, and sentence clauses.',
    keyQuestions: ['What do the original Greek/Hebrew words mean?', 'How are sentences syntactically connected?', 'Are there figures of speech?']
  },
  {
    stepNumber: 3,
    title: 'INVESTIGATE HISTORICAL CONTEXT',
    subtitle: 'Historical Dimension',
    prompt: 'Author, audience, time, place, culture',
    iconName: 'Landmark',
    color: '#B45309',
    description: 'Reconstruct the 1st-century Greco-Roman or ancient Near Eastern setting, customs, politics, and geography.',
    keyQuestions: ['Who wrote this book and when?', 'What crisis or situation faced the original recipients?', 'What cultural customs inform the imagery?']
  },
  {
    stepNumber: 4,
    title: 'ANALYZE LITERARY CONTEXT',
    subtitle: 'Literary Context',
    prompt: 'Genre, structure, surrounding verses',
    iconName: 'BookOpen',
    color: '#4F46E5',
    description: 'Discern the literary genre (epistle, narrative, poetry, prophecy) and follow the argument through surrounding paragraphs.',
    keyQuestions: ['What genre is this book?', 'How does this paragraph flow from the preceding passage?', 'What follows immediately after?']
  },
  {
    stepNumber: 5,
    title: 'IDENTIFY ORIGINAL INTENDED MEANING',
    subtitle: 'Authorial Intent',
    prompt: 'What did the author intend to communicate?',
    iconName: 'Target',
    color: '#BE123C',
    description: 'Determine what the divinely inspired human author meant to communicate to his immediate target audience.',
    keyQuestions: ['What did Paul, Moses, or John mean?', 'What single truth was being taught to the original hearers?', 'Why did God include this here?']
  },
  {
    stepNumber: 6,
    title: 'FORMULATE SOUND THEOLOGICAL INTERPRETATION',
    subtitle: 'Theological Synthesis',
    prompt: 'What is the meaning of the text?',
    iconName: 'Lightbulb',
    color: '#2563EB',
    description: 'Synthesize the universal, timeless doctrinal truth across the canon of Scripture without contradiction.',
    keyQuestions: ['What universal theological principle is revealed?', 'How does this harmonize with the rest of Scripture?', 'How does this point to Christ?']
  },
  {
    stepNumber: 7,
    title: 'APPLY THE TRUTH FAITHFULLY',
    subtitle: 'Contemporary Application',
    prompt: 'How does this apply to our lives today?',
    iconName: 'HeartHandshake',
    color: '#059669',
    description: 'Translate the timeless principle into practical Christian discipleship, ethics, church life, and personal holiness.',
    keyQuestions: ['What attitude must change in my heart?', 'How does this guide our church and ministry today?', 'What concrete obedience does God require?']
  }
];

export const HERMENEUTICS_STORYBOARD_SCENES: StoryboardScene[] = [
  {
    id: 'scene-1',
    sceneNumber: 1,
    timeRange: '0:00–0:30',
    startSeconds: 0,
    endSeconds: 30,
    title: 'Opening / Introduction',
    subtitle: 'Foundations of Biblical Hermeneutics: The Historical-Grammatical Method',
    visuals: 'BIBU TV logo animation, open Bible with gold ribbon, academic bookshelf studio backdrop. Lecturer enters studio, greets students warmly with Bible open on lectern.',
    onScreenText: [
      'Welcome to BIBU TV',
      'Foundations of Biblical Hermeneutics',
      'Lesson 1: The Historical-Grammatical Method'
    ],
    wordForWordNarration: '"Welcome to Breakthrough International Bible University. I am delighted to have you in this lesson on Biblical Hermeneutics. Today, we begin our study of one of the most important approaches to interpreting Scripture: The Historical-Grammatical Method. This method has helped generations of scholars, pastors, and believers understand the Word of God accurately and faithfully."',
    theologicalTerms: ['Hermeneutics', 'Historical-Grammatical Method', 'Exegesis', 'Biblical Authority'],
    lecturerVisibilityPercent: 65,
    diagramType: 'opening',
    notes: 'Use lower-third identification: BIBU THEOLOGY LECTURE — Foundations of Biblical Hermeneutics. Upbeat, reverent academic intro.'
  },
  {
    id: 'scene-2',
    sceneNumber: 2,
    timeRange: '0:30–1:20',
    startSeconds: 30,
    endSeconds: 80,
    title: 'Definition: What is Hermeneutics?',
    subtitle: 'The Science and Art of Biblical Interpretation',
    visuals: 'Lecturer on primary camera with animated graphic overlays defining Hermeneutics, transitioning into three interlocking pillars: Observation, Interpretation, Application.',
    onScreenText: [
      'Hermeneutics: Science & Art of Biblical Interpretation',
      'Observation — What does the text say?',
      'Interpretation — What does the text mean?',
      'Application — What does the text mean for us today?'
    ],
    wordForWordNarration: '"Hermeneutics simply means the science or art of interpreting the Bible. The Bible was not written in our time, in our language, or in our culture. Therefore, we must learn how to understand it correctly. Hermeneutics involves three steps: Observation – what does the text say? Interpretation – what does the text mean? Application – what does the text mean for us today?"',
    theologicalTerms: ['Observation', 'Interpretation', 'Application', 'Illumination'],
    lecturerVisibilityPercent: 55,
    diagramType: 'definition',
    notes: 'Large typography for the 3 pillars. Visual emphasis on the bridge between ancient text and modern believer.'
  },
  {
    id: 'scene-3',
    sceneNumber: 3,
    timeRange: '1:20–2:20',
    startSeconds: 80,
    endSeconds: 140,
    title: 'Why Interpretation Matters',
    subtitle: 'Rightly Dividing the Word of Truth',
    visuals: 'Split-screen graphic showing ancient biblical world (scrolls, Roman empire, temple) on the left and a modern reader with a smartphone Bible on the right. Visual comparison between confusion vs. clarity.',
    onScreenText: [
      'Rightly Dividing the Word of Truth',
      '— 2 Timothy 2:15',
      'Handle God\'s Word Correctly',
      'Discover Original Authorial Intent'
    ],
    wordForWordNarration: '"Why is careful interpretation so important? Because the Bible is timeless, but it was written in a specific time. Without proper interpretation, we can easily misunderstand God’s Word, apply it wrongly, or even teach error. Our goal is to discover what the original author intended to communicate to the original audience."',
    theologicalTerms: ['Authorial Intent', '2 Timothy 2:15 (Orthotomeo)', 'Eisegesis vs. Exegesis', 'Inerrancy'],
    lecturerVisibilityPercent: 50,
    diagramType: 'why_matters',
    notes: 'Split-screen visual: Ancient Context vs. Modern Reader. Display 2 Timothy 2:15 text in elegant serif type.'
  },
  {
    id: 'scene-4',
    sceneNumber: 4,
    timeRange: '2:20–3:40',
    startSeconds: 140,
    endSeconds: 220,
    title: 'The Historical Dimension',
    subtitle: 'The 6 Crucial Investigative Questions',
    visuals: 'Ancient Roman ruins, 1st-century Aegean Sea map, timeline transitions, papyrus manuscript imagery, highlighting the historical context checklist.',
    onScreenText: [
      'Historical Context: Who? When? Where? Why?',
      '• Author — Who wrote the passage?',
      '• Audience — Who was the original audience?',
      '• Date — When was it written?',
      '• Place — Where was it written & received?',
      '• Political — What empires & rulers reigned?',
      '• Cultural — What customs & traditions existed?'
    ],
    wordForWordNarration: '"The first key of the Historical-Grammatical Method is the historical context. We must ask: Who wrote the passage? Who was the original audience? When was it written? Where was it written? What was happening in that time? What were the political, social, and cultural conditions?"',
    theologicalTerms: ['Sitz im Leben (Setting in Life)', 'Historical Context', 'Original Audience', 'Cultural Milieu'],
    lecturerVisibilityPercent: 45,
    diagramType: 'historical',
    notes: 'Map zoom from Rome across Greece to Philippi. Historical checklist points appear one-by-one with subtle sound chime.'
  },
  {
    id: 'scene-5',
    sceneNumber: 5,
    timeRange: '3:40–5:00',
    startSeconds: 220,
    endSeconds: 300,
    title: 'The Grammatical Dimension',
    subtitle: 'Words, Grammar, Syntax, Genre & Context',
    visuals: 'High-definition Greek and Hebrew uncial manuscript visuals, highlighted Greek sentence structures, diagram of rhetorical clauses, and literary genre categories.',
    onScreenText: [
      'Grammatical Context',
      '• Words — Lexical meaning in original languages',
      '• Grammar — Parts of speech, verb tenses & voices',
      '• Structure — Sentence syntax & connectors',
      '• Literary Genre — Epistle, Narrative, Poetry, Prophecy',
      '• Context — Surrounding verses & chapter flow'
    ],
    wordForWordNarration: '"The second key is the grammatical context. We must examine the words, grammar, sentence structure, and literary style. What is the meaning of key words in their original language? What is the structure of the sentence? How do the surrounding verses help us understand the key passage?"',
    theologicalTerms: ['Koine Greek', 'Biblical Hebrew', 'Syntax', 'Literary Genre', 'Immediate Context'],
    lecturerVisibilityPercent: 50,
    diagramType: 'grammatical',
    notes: 'Display Greek word "λόγος" and sentence diagramming overlay. Clean, legible typography for language rules.'
  },
  {
    id: 'scene-6',
    sceneNumber: 6,
    timeRange: '5:00–6:30',
    startSeconds: 300,
    endSeconds: 390,
    title: 'The Method: The 7-Step Process',
    subtitle: 'Step-by-Step Flowchart of Biblical Exegesis',
    visuals: 'Animated seven-step flowchart expanding vertically with clear arrow pathways, step icons, and illuminated active highlights matching the lecture progression.',
    onScreenText: [
      'The Historical-Grammatical Process:',
      '1. OBSERVE THE TEXT (What does it say?)',
      '2. EXAMINE THE LANGUAGE (Words, grammar, structure)',
      '3. INVESTIGATE HISTORICAL CONTEXT (Author, audience, time, place)',
      '4. ANALYZE LITERARY CONTEXT (Genre, surrounding verses)',
      '5. IDENTIFY ORIGINAL INTENDED MEANING (Author\'s intent)',
      '6. FORMULATE SOUND THEOLOGICAL INTERPRETATION',
      '7. APPLY THE TRUTH FAITHFULLY (To our lives today)'
    ],
    wordForWordNarration: '"Now let’s bring it together. The Historical-Grammatical Method follows a clear process: First, Observe the text. Second, Examine the language. Third, Investigate historical context. Fourth, Analyze literary context. Fifth, Identify original intended meaning. Sixth, Formulate sound theological interpretation. And seventh, Apply the truth faithfully to our lives today."',
    theologicalTerms: ['Exegesis', 'Theological Synthesis', 'Hermeneutical Spiral', 'Canon of Scripture'],
    lecturerVisibilityPercent: 40,
    diagramType: 'flowchart',
    notes: 'Featured flowchart animation as shown in BIBU TV design sheet. Smooth step-by-step glowing indicators.'
  },
  {
    id: 'scene-7',
    sceneNumber: 7,
    timeRange: '6:30–8:30',
    startSeconds: 390,
    endSeconds: 510,
    title: 'Practical Case Study: Philippians 4:13',
    subtitle: 'Context Matters — Not an Athletic Slogan, but Contentment in Suffering',
    visuals: 'Map of Philippi, Apostle Paul in Roman imprisonment, Bible passage displaying Philippians 4:10–14 with verse 13 highlighted in its surrounding literary paragraph. Animated five-stage context diagram.',
    onScreenText: [
      'Philippians 4:13 — Context Matters',
      '"I can do all things through Christ who strengthens me."',
      'CONTEXT DIAGRAM:',
      'VERSE → IMMEDIATE CONTEXT → HISTORICAL CONTEXT → ORIGINAL MEANING → APPLICATION',
      'Surrounding Verses (Phil 4:11-12):',
      '"I have learned in whatever state I am, to be content... both to be full and to be hungry."'
    ],
    wordForWordNarration: '"Let’s apply this method to Philippians 4:13. The verse says, “I can do all things through Christ who strengthens me.” Many people use this verse to claim unlimited power or athletic victory. But let’s see what it really means when we look at the immediate context: Paul is writing from a Roman prison! In verses 11 and 12, Paul says he has learned to be content in hunger, want, poverty, or abundance. The “all things” does not mean scoring touchdowns or becoming rich; it means enduring any hardship or suffering through Christ’s sustaining strength!"',
    theologicalTerms: ['Contextual Exegesis', 'Suffering & Contentment', 'Immediate Literary Context', 'Pauline Epistles'],
    lecturerVisibilityPercent: 55,
    diagramType: 'philippians',
    notes: 'CRITICAL PRODUCTION DIRECTIVE: Visually show verses 10–14 rather than presenting v13 in isolation. Display the 5-stage context chain.'
  },
  {
    id: 'scene-8',
    sceneNumber: 8,
    timeRange: '8:30–9:30',
    startSeconds: 510,
    endSeconds: 570,
    title: 'Common Interpretive Errors to Avoid',
    subtitle: 'Warning Signs of Bad Hermeneutics',
    visuals: 'Prominent caution/warning graphic badges, visual demonstration of an isolated verse snippet, proof-texting traps, reading modern assumptions into ancient letters.',
    onScreenText: [
      'Avoid Contextual Misinterpretation:',
      '1. Isolation — Ripping single verses out of their chapter',
      '2. Assumptions — Imposing 21st-century modern ideas onto ancient text',
      '3. Ignorance — Disregarding ancient historical background',
      '4. Misapplication — Jumping straight to "what it means to me" without studying what it meant'
    ],
    wordForWordNarration: '"There are common mistakes in interpretation: First, taking verses out of context. Second, reading our own ideas into the Bible. Third, ignoring the historical background. Fourth, ignoring grammar and word meaning. Fifth, confusing application with interpretation. If you bypass what God originally said, you substitute your own voice for God’s Word."',
    theologicalTerms: ['Proof-texting', 'Eisegesis', 'Anachronism', 'Selective Literalism'],
    lecturerVisibilityPercent: 50,
    diagramType: 'errors',
    notes: 'Red and amber warning icon graphics with stark contrast. Clear visual barriers against eisegesis.'
  },
  {
    id: 'scene-9',
    sceneNumber: 9,
    timeRange: '9:30–10:00',
    startSeconds: 570,
    endSeconds: 600,
    title: 'Conclusion & Official Closing Slate',
    subtitle: 'Study Faithfully • Interpret Carefully • Apply Wisely',
    visuals: 'Lecturer closes Bible with smile and reverent posture, looking into the lens. Fade to cinematic BIBU TV gold-crested closing title screen with university accreditation motto.',
    onScreenText: [
      'Rightly Understand • Rightly Divide • Rightly Apply',
      'BREAKTHROUGH INTERNATIONAL BIBLE UNIVERSITY',
      'BIBU TV',
      'Equipping God\'s People for Effective Kingdom Ministry',
      'Foundations of Biblical Hermeneutics',
      'Lesson 1: The Historical-Grammatical Method'
    ],
    wordForWordNarration: '"Faithful interpretation begins with faithful observation. Before we ask, “What does this verse mean for me?”, we must first ask, “What did it mean to them?” When we follow this method, we will rightly understand God’s Word and apply it faithfully to our lives. Thank you for joining me in this lesson. Continue to the next lesson in the BIBU School of Theology. God bless you."',
    theologicalTerms: ['Rightly Dividing', 'Kingdom Ministry', 'Faithful Exegesis', 'Soli Deo Gloria'],
    lecturerVisibilityPercent: 60,
    diagramType: 'closing',
    notes: 'Closing screen matches exact university branding specifications: Royal Blue, Gold, and BIBU crest.'
  }
];

export const PHILIPPIANS_CONTEXT_PASSAGE = {
  reference: 'Philippians 4:10–14 (ESV / NKJV)',
  historicalContext: 'Written around 61–62 A.D. by the Apostle Paul while under house arrest in Rome, guarded by Roman soldiers, awaiting trial before Caesar Nero.',
  verses: [
    {
      num: 10,
      text: 'I rejoiced in the Lord greatly that now at length you have revived your concern for me. You were indeed concerned for me, but you had no opportunity.',
      isHighlight: false
    },
    {
      num: 11,
      text: 'Not that I am speaking of being in need, for I have learned in whatever situation I am to be content.',
      isHighlight: false
    },
    {
      num: 12,
      text: 'I know how to be brought low, and I know how to abound. In any and every circumstance, I have learned the secret of facing plenty and hunger, abundance and need.',
      isHighlight: false
    },
    {
      num: 13,
      text: 'I can do all things through him who strengthens me.',
      isHighlight: true,
      label: 'The Target Verse'
    },
    {
      num: 14,
      text: 'Yet it was kind of you to share my trouble.',
      isHighlight: false
    }
  ],
  fiveStageFlow: [
    { stage: 'VERSE', label: 'Phil 4:13', desc: '"I can do all things through Christ..."' },
    { stage: 'IMMEDIATE CONTEXT', label: 'Verses 10-14', desc: 'Contentment in hunger, imprisonment, and financial need' },
    { stage: 'HISTORICAL CONTEXT', label: 'Rome 62 A.D.', desc: 'Paul chained in prison facing possible Roman execution' },
    { stage: 'ORIGINAL MEANING', label: 'Christ\'s Sufficiency', desc: 'Supernatural grace to endure any physical circumstance for the Gospel' },
    { stage: 'APPLICATION', label: 'Discipleship Today', desc: 'Finding spiritual peace and steadfastness through trials, not worldly entitlement' }
  ]
};
