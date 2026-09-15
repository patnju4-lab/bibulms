import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  Printer,
  Search,
  Filter,
  FileText,
  User,
  ShieldCheck,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
  Sparkles,
  HelpCircle,
  Check,
  X,
  AlertCircle,
  Download,
  Send,
  MessageSquare,
  Target
} from 'lucide-react';

export interface ChristianMinistryRplBankProps {
  onClose?: () => void;
  candidateNameDefault?: string;
  assessorNameDefault?: string;
}

interface ModuleData {
  id: string;
  title: string;
  code: string;
  description: string;
  oralQuestions: string[];
  practicalTasks: {
    title: string;
    description: string;
    observationCriteria: string[];
  }[];
}

const MODULES: ModuleData[] = [
  {
    id: 'chaplaincy',
    title: '1. Apply Principles of Chaplaincy',
    code: 'MIN-L4-01',
    description: 'Core competencies in providing spiritual support, active listening, ethical boundaries, confidentiality, and crisis response in institutional settings.',
    oralQuestions: [
      'What is chaplaincy, and what is the primary role of a chaplain?',
      'Explain the difference between chaplaincy and ordinary pastoral ministry.',
      'What ethical principles should guide a chaplain when dealing with vulnerable people?',
      'How would you maintain confidentiality when a person shares a sensitive matter with you?',
      'How would you provide spiritual support to a person from a different Christian denomination?',
      'How would you minister to a person who is not a Christian?',
      'What would you do when a person requests prayer but does not want religious counselling?',
      'Explain the importance of active listening in chaplaincy.',
      'What would you do if a person disclosed that they intended to harm themselves or another person?',
      'Why is professional referral important in chaplaincy?'
    ],
    practicalTasks: [
      {
        title: 'Task 1: Chaplaincy Counselling & Grief Support Simulation',
        description: 'Conduct a 10-minute chaplaincy counselling/support session with a simulated client experiencing grief.',
        observationCriteria: [
          'Introduction and rapport',
          'Active listening & presence',
          'Appropriate questioning',
          'Empathy and compassion',
          'Spiritual sensitivity',
          'Confidentiality assurance',
          'Prayer where appropriate',
          'Referral where necessary',
          'Proper closing of the session'
        ]
      },
      {
        title: 'Task 2: Institutional Spiritual Support Demonstration',
        description: 'Demonstrate how you would provide spiritual support to a patient/family member in a hospital or bereaved family.',
        observationCriteria: [
          'Respect for institutional protocols',
          'Calm, reassuring presence',
          'Scriptural comfort & hope',
          'Appropriate pastoral touch/distance',
          'Family engagement'
        ]
      }
    ]
  },
  {
    id: 'ministerial-word',
    title: '2. Ministerial the Word 1',
    code: 'MIN-L4-02',
    description: 'Hermeneutics, sermon preparation, expository preaching, theological accuracy, and modern congregation application.',
    oralQuestions: [
      'What does it mean to minister the Word of God?',
      'What is the difference between preaching and teaching?',
      'What are the basic steps in preparing a sermon?',
      'Why is biblical context important when interpreting Scripture?',
      'Explain the difference between the meaning of a biblical text and its application to a modern congregation.',
      'What is an expository sermon?',
      'How do you select a suitable Scripture for a particular congregation or occasion?',
      'What makes a good sermon introduction?',
      'How do you ensure that your sermon remains faithful to Scripture?',
      'How do you evaluate whether your preaching has effectively communicated the intended message?'
    ],
    practicalTasks: [
      {
        title: 'Task 1: Sermon Preparation and Delivery',
        description: 'Prepare and deliver a 10–15 minute sermon from a selected biblical passage.',
        observationCriteria: [
          'Appropriate Scripture selection',
          'Correct grammatical & historical interpretation',
          'Clear introduction',
          'Structured main points',
          'Biblical support & references',
          'Practical application to life',
          'Appropriate illustrations',
          'Effective vocal & non-verbal communication',
          'Conclusion & Call to appropriate response'
        ]
      },
      {
        title: 'Task 2: Exegetical Analysis of Assigned Passage',
        description: 'Given a Bible passage by the assessor, explain its context, main message, meaning, and application.',
        observationCriteria: [
          'Accurate historical-cultural context',
          'Clear identification of core theology',
          'Relevance to contemporary believers'
        ]
      }
    ]
  },
  {
    id: 'church-missions',
    title: '3. Conduct Church Missions Operation',
    code: 'MIN-L4-03',
    description: 'Planning, organizing, and executing cross-cultural or local evangelistic missions, community engagement, and follow-up strategies.',
    oralQuestions: [
      'What is the meaning and purpose of Christian mission?',
      'What are the major stages in planning a church mission?',
      'How do you identify a target community for mission work?',
      'What preparations should be made before conducting an evangelistic activity?',
      'How do you mobilize church members for a mission?',
      'What resources are required for a successful mission?',
      'How would you approach people from different cultural backgrounds?',
      'How do you follow up new converts after an evangelistic activity?',
      'What safety and ethical considerations should be observed during missions?',
      'How do you evaluate the success of a church mission?'
    ],
    practicalTasks: [
      {
        title: 'Task 1: One-Day Church Mission Plan Development',
        description: 'Develop a comprehensive one-day church mission plan for a local community.',
        observationCriteria: [
          'Mission objectives & KPIs',
          'Target population profile',
          'Detailed programme & timeline',
          'Team members & responsibilities',
          'Evangelism strategy & materials',
          'Resources, budget & logistics',
          'Transport & safety considerations',
          'Follow-up & discipleship strategy',
          'Evaluation metrics'
        ]
      },
      {
        title: 'Task 2: Evangelistic Presentation Demonstration',
        description: 'Demonstrate a 5–10 minute evangelistic presentation to a simulated community member.',
        observationCriteria: [
          'Clear presentation of the Gospel message',
          'Warm, respectful tone',
          'Handling questions with grace',
          'Clear invitation to faith'
        ]
      }
    ]
  },
  {
    id: 'pastoral-ministry',
    title: '4. Provide Pastoral Ministry 1',
    code: 'MIN-L4-04',
    description: 'Pastoral care, counselling, visitation, crisis intervention, conflict resolution, and maintaining professional boundaries.',
    oralQuestions: [
      'What is pastoral ministry?',
      'What are the major responsibilities of a pastor?',
      'What qualities should an effective pastoral minister possess?',
      'What is pastoral counselling?',
      'How do you handle a person experiencing grief?',
      'How would you respond when two church members have a conflict?',
      'How do you maintain confidentiality in pastoral ministry?',
      'When should a pastor refer a person to a professional counsellor, doctor or other specialist?',
      'How do you provide pastoral care to elderly, sick or vulnerable members?',
      'What is the importance of pastoral visitation?',
      'How do you support a family preparing for a funeral?',
      'How do you maintain appropriate professional boundaries with members of the congregation?'
    ],
    practicalTasks: [
      {
        title: 'Task 1: Pastoral Counselling Simulation',
        description: 'Conduct a 10-minute pastoral counselling session with a simulated church member experiencing a personal or family problem.',
        observationCriteria: [
          'Establishing safe therapeutic space',
          'Active listening without premature judgment',
          'Biblical wisdom integration',
          'Emotional empathy and support',
          'Appropriate boundaries & referral protocol'
        ]
      },
      {
        title: 'Task 2: Pastoral Home Visit Demonstration',
        description: 'Demonstrate how you would conduct a structured pastoral home visit.',
        observationCriteria: [
          'Professional introduction & rapport',
          'Attentive listening to family concerns',
          'Appropriate Scripture reading & prayer',
          'Confidentiality assurance',
          'Closing and pastoral follow-up plan'
        ]
      }
    ]
  },
  {
    id: 'spiritual-services',
    title: '5. Conduct Spiritual Services',
    code: 'MIN-L4-05',
    description: 'Liturgy and administration of worship services, communion, baptism, weddings, funerals, and unexpected situation management.',
    oralQuestions: [
      'What is a spiritual service?',
      'What are the major components of a Christian worship service?',
      'What is the role of the minister during a worship service?',
      'How do you prepare a service programme?',
      'Why is proper order important during worship?',
      'How would you lead congregational prayer?',
      'What principles should guide the selection of songs and Scripture readings?',
      'How would you conduct a communion service?',
      'How would you prepare and conduct a funeral service?',
      'How do you conduct a baptism service?',
      'How do you manage unexpected situations during a church service?',
      'How do you ensure that worship is inclusive and respectful?'
    ],
    practicalTasks: [
      {
        title: 'Task 1: Simulated Worship Service Direction',
        description: 'Conduct a 10–15 minute simulated spiritual service including opening, welcome, Scripture, prayer, worship, short exhortation, and blessing.',
        observationCriteria: [
          'Seamless service flow & timing',
          'Reverence and spiritual atmosphere',
          'Clear congregational leadership',
          'Inspiring short exhortation',
          'Orderly closing blessing'
        ]
      },
      {
        title: 'Task 2: Special Ritual / Ordinance Demonstration',
        description: 'Demonstrate how you would lead one specialized service: Funeral, Baptism, Communion, Marriage, or Prayer service.',
        observationCriteria: [
          'Adherence to sacred liturgical tradition',
          'Pastorally sensitive delivery',
          'Clear explanations for participants',
          'Dignified execution'
        ]
      }
    ]
  },
  {
    id: 'community-activities',
    title: '6. Conduct Church Community Activities',
    code: 'MIN-L4-06',
    description: 'Community development, social outreach, volunteer mobilization, partnerships, resource management, and social impact evaluation.',
    oralQuestions: [
      'What is the role of the church in community development?',
      'Give examples of church community activities.',
      'How do you identify the needs of a community?',
      'How would you organize a church community outreach programme?',
      'How do you mobilize volunteers?',
      'What partnerships can a church establish with community organizations?',
      'How would you ensure that community activities benefit vulnerable groups?',
      'What ethical principles should guide church community work?',
      'How do you manage resources during a community project?',
      'How do you monitor and evaluate a community activity?',
      'Give an example of a community activity you have personally organized or participated in.',
      'What evidence can you provide to demonstrate your experience in community activities?'
    ],
    practicalTasks: [
      {
        title: 'Task 1: Community Outreach Project Proposal',
        description: 'Develop a church community outreach project addressing one identified local need (e.g. food support, youth empowerment, visiting sick, clean-up, health awareness).',
        observationCriteria: [
          'Clear community need assessment',
          'Measurable objectives & beneficiaries',
          'Actionable activities & timeline',
          'Volunteer team & responsibilities',
          'Resource & budget planning',
          'Risk & safety considerations',
          'Monitoring and evaluation framework'
        ]
      },
      {
        title: 'Task 2: Stakeholder & Volunteer Mobilization',
        description: 'Demonstrate how you would mobilize church members and community stakeholders to participate in the project.',
        observationCriteria: [
          'Compelling vision casting',
          'Clear role delegation',
          'Enthusiastic engagement',
          'Addressing logistical concerns'
        ]
      }
    ]
  }
];

const CROSS_CUTTING_QUESTIONS = [
  'Tell us about your ministry experience and the church/ministry where you have served.',
  'How many years have you been actively involved in Christian ministry?',
  'Which ministry responsibilities have you personally performed?',
  'Describe one difficult pastoral situation you handled and what you learned from it.',
  'Describe a mission or evangelistic activity that you organized or participated in.',
  'Give an example of a pastoral counselling case you handled.',
  'Describe a spiritual service you have conducted.',
  'Describe a community activity you have organized or participated in.',
  'What evidence in your Portfolio of Evidence supports your answers?',
  'Which certificates, recommendation letters, photographs, programmes, sermon notes, church records or other documents authenticate your experience?',
  'What have you learned through practical ministry that was not learned in a classroom?',
  'If given the same ministry responsibility today, what would you do differently?'
];

const CHECKLIST_ITEMS = [
  'Demonstrates biblical knowledge',
  'Communicates clearly',
  'Demonstrates pastoral sensitivity',
  'Demonstrates active listening',
  'Demonstrates counselling skills',
  'Demonstrates leadership',
  'Demonstrates ethical conduct',
  'Demonstrates mission skills',
  'Conducts spiritual services appropriately',
  'Demonstrates community engagement',
  'Uses ministry experience effectively',
  'Provides authentic supporting evidence'
];

export const ChristianMinistryRplBank: React.FC<ChristianMinistryRplBankProps> = ({
  onClose,
  candidateNameDefault = 'Rev. David Kariuki',
  assessorNameDefault = 'Dr. Samuel Mwangi (Principal Assessor)'
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'crosscutting' | 'checklist' | 'export'>('modules');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('chaplaincy');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Assessment State
  const [candidateName, setCandidateName] = useState<string>(candidateNameDefault);
  const [assessorName, setAssessorName] = useState<string>(assessorNameDefault);
  const [assessmentDate, setAssessmentDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Checklist ratings: { [itemIndex]: 'Competent' | 'Not Yet Competent' }
  const [checklistRatings, setChecklistRatings] = useState<Record<number, 'Competent' | 'Not Yet Competent'>>({
    0: 'Competent',
    1: 'Competent',
    2: 'Competent',
    3: 'Competent',
    4: 'Competent',
    5: 'Competent',
    6: 'Competent',
    7: 'Competent',
    8: 'Competent',
    9: 'Competent',
    10: 'Competent',
    11: 'Competent'
  });

  const [checklistComments, setChecklistComments] = useState<Record<number, string>>({});
  const [overallDecision, setOverallDecision] = useState<string>('Competent – Full Qualification');
  const [assessorGeneralComments, setAssessorGeneralComments] = useState<string>(
    'Candidate demonstrated robust pastoral competence, orthodox biblical exposition, and mature chaplaincy skills across all 6 Level 4 units. Portfolio of evidence is authentic and current.'
  );
  const [internalVerifier, setInternalVerifier] = useState<string>('Bishop Dr. Rachel Wanjiru');
  const [verifierDate, setVerifierDate] = useState<string>('2026-06-20');

  // Interactive Question Practice Notes
  const [candidateNotes, setCandidateNotes] = useState<Record<string, string>>({});

  const handleRatingChange = (idx: number, status: 'Competent' | 'Not Yet Competent') => {
    setChecklistRatings(prev => ({ ...prev, [idx]: status }));
  };

  const handleCommentChange = (idx: number, text: string) => {
    setChecklistComments(prev => ({ ...prev, [idx]: text }));
  };

  const activeModule = MODULES.find(m => m.id === selectedModuleId) || MODULES[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="christian-ministry-rpl-bank" className="bg-slate-50 min-h-screen p-4 sm:p-8 space-y-6">
      {/* TOP BANNER */}
      <div className="bg-gradient-to-r from-[#002366] via-[#001A4D] to-[#001233] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-[#C5A059] text-[#002366] text-xs font-black uppercase tracking-widest shadow-xs">
                TVET Level 4 Accreditation
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-mono font-semibold">
                RPL Competency-Based Assessment
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
              Christian Ministry Level 4: Oral & Practical RPL Question Bank
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-3xl">
              Comprehensive Recognition of Prior Learning (RPL) assessment instrument for experienced ministers. Combining oral questioning, practical performance observation, and Portfolio of Evidence (PoE) verification.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-white/20 flex items-center gap-2 shadow-xs"
            >
              <Printer className="w-4 h-4 text-[#C5A059]" />
              <span>Print / Export PDF</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2.5 bg-[#C5A059] hover:bg-[#b28d4a] text-[#002366] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                <span>Close Instrument</span>
              </button>
            )}
          </div>
        </div>

        {/* METADATA FORM BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10 text-xs">
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold uppercase tracking-wider text-[10px]">Candidate Name</label>
            <input
              type="text"
              value={candidateName}
              onChange={e => setCandidateName(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#C5A059]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold uppercase tracking-wider text-[10px]">Assessor Name</label>
            <input
              type="text"
              value={assessorName}
              onChange={e => setAssessorName(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#C5A059]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold uppercase tracking-wider text-[10px]">Assessment Date</label>
            <input
              type="date"
              value={assessmentDate}
              onChange={e => setAssessmentDate(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#C5A059]"
            />
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('modules')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'modules'
              ? 'bg-[#002366] text-[#C5A059] shadow-sm font-black'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#C5A059]" />
          <span>6 Core Modules & Practical Tasks</span>
        </button>

        <button
          onClick={() => setActiveTab('crosscutting')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'crosscutting'
              ? 'bg-[#002366] text-[#C5A059] shadow-sm font-black'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-[#C5A059]" />
          <span>Cross-Cutting Authentication Qs</span>
        </button>

        <button
          onClick={() => setActiveTab('checklist')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'checklist'
              ? 'bg-[#002366] text-[#C5A059] shadow-sm font-black'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CheckSquare className="w-4 h-4 text-[#C5A059]" />
          <span>Practical Observation Checklist</span>
        </button>

        <button
          onClick={() => setActiveTab('export')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'export'
              ? 'bg-[#002366] text-[#C5A059] shadow-sm font-black'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4 text-[#C5A059]" />
          <span>Assessor Decision & Signatures</span>
        </button>
      </div>

      {/* TAB 1: MODULES & PRACTICAL TASKS */}
      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Module Selector Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-1">
              Select Ministry Module ({MODULES.length})
            </div>
            <div className="space-y-1.5">
              {MODULES.map(mod => {
                const isSelected = selectedModuleId === mod.id;
                return (
                  <button
                    key={mod.id}
                    onClick={() => setSelectedModuleId(mod.id)}
                    className={`w-full text-left p-3.5 rounded-xl transition-all flex flex-col space-y-1 ${
                      isSelected
                        ? 'bg-[#002366] text-white shadow-md border-l-4 border-[#C5A059]'
                        : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono opacity-80">
                      <span>{mod.code}</span>
                      <span>Module</span>
                    </div>
                    <div className="text-xs font-bold font-display line-clamp-1">
                      {mod.title}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Module Detail Content */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-[#002366]/10 text-[#002366]">
                    {activeModule.code}
                  </span>
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    Evidence Standard: Sufficient, Valid, Authentic & Current
                  </span>
                </div>
                <h2 className="text-xl font-bold font-display text-[#002366]">
                  {activeModule.title}
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeModule.description}
                </p>
              </div>

              {/* A. Oral Questions Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold font-display text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#002366]" />
                    <span>A. Oral Questions ({activeModule.oralQuestions.length})</span>
                  </h3>
                  <span className="text-xs text-slate-500">Candidate Verbal Assessment</span>
                </div>

                <div className="space-y-3">
                  {activeModule.oralQuestions.map((question, qIdx) => {
                    const qKey = `${activeModule.id}-q-${qIdx}`;
                    return (
                      <div key={qIdx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-xs font-mono font-bold text-[#002366] bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                            Q{qIdx + 1}
                          </span>
                          <p className="text-xs font-semibold text-slate-800 flex-1 leading-normal">
                            {question}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-slate-200/60">
                          <input
                            type="text"
                            placeholder="Enter candidate's oral response or assessor notes..."
                            value={candidateNotes[qKey] || ''}
                            onChange={e => setCandidateNotes({ ...candidateNotes, [qKey]: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#002366]"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* B. Practical Tasks Section */}
              <div className="space-y-4 pt-6 border-t border-slate-200">
                <h3 className="text-sm font-bold font-display text-slate-900 flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#002366]" />
                  <span>B. Practical Tasks & Observations ({activeModule.practicalTasks.length})</span>
                </h3>

                <div className="space-y-4">
                  {activeModule.practicalTasks.map((task, tIdx) => (
                    <div key={tIdx} className="p-5 rounded-2xl border border-slate-200 bg-blue-50/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#002366] uppercase tracking-wider">
                          Task {tIdx + 1}: {task.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-[#002366] font-semibold">
                          Assessor Observation
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 italic">
                        {task.description}
                      </p>

                      <div className="space-y-2 pt-2">
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Assessor Observation Criteria:
                        </div>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {task.observationCriteria.map((crit, cIdx) => (
                            <li key={cIdx} className="text-xs flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="text-slate-700">{crit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CROSS-CUTTING AUTHENTICATION QUESTIONS */}
      {activeTab === 'crosscutting' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4 space-y-1">
            <span className="text-xs text-[#002366] uppercase tracking-wider font-bold">
              Prior Learning & Portfolio Authentication
            </span>
            <h2 className="text-xl font-bold font-display text-[#002366]">
              RPL Cross-Cutting Authentication Questions
            </h2>
            <p className="text-xs text-slate-600">
              These questions are particularly useful because the candidate is claiming prior learning and extensive practical ministry experience.
            </p>
          </div>

          <div className="space-y-4">
            {CROSS_CUTTING_QUESTIONS.map((ccQ, idx) => {
              const ccKey = `cc-${idx}`;
              return (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono font-bold text-[#002366] bg-white px-2.5 py-1 rounded border border-slate-200 shrink-0">
                      CC-{idx + 1}
                    </span>
                    <p className="text-xs font-semibold text-slate-900 flex-1 pt-0.5">
                      {ccQ}
                    </p>
                  </div>
                  <div className="pl-9">
                    <textarea
                      rows={2}
                      placeholder="Enter candidate's authenticated portfolio response..."
                      value={candidateNotes[ccKey] || ''}
                      onChange={e => setCandidateNotes({ ...candidateNotes, [ccKey]: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-[#002366]"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PRACTICAL RPL OBSERVATION CHECKLIST */}
      {activeTab === 'checklist' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4 space-y-1">
            <span className="text-xs text-[#002366] uppercase tracking-wider font-bold">
              Assessor Evaluation Matrix
            </span>
            <h2 className="text-xl font-bold font-display text-[#002366]">
              Practical RPL Observation Checklist
            </h2>
            <p className="text-xs text-slate-600">
              Evaluate candidate competency across all 12 core performance indicators based on oral questions, practical task simulations, and verified Portfolio of Evidence (PoE).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 uppercase font-bold tracking-wider border-b border-slate-200">
                  <th className="p-3.5">Competency Indicator</th>
                  <th className="p-3.5 text-center w-32">Competent</th>
                  <th className="p-3.5 text-center w-40">Not Yet Competent</th>
                  <th className="p-3.5">Assessor Comments / Evidence Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {CHECKLIST_ITEMS.map((item, idx) => {
                  const rating = checklistRatings[idx] || 'Competent';
                  return (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 font-semibold text-slate-900">
                        {idx + 1}. {item}
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => handleRatingChange(idx, 'Competent')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            rating === 'Competent'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          ✓ Competent
                        </button>
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => handleRatingChange(idx, 'Not Yet Competent')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            rating === 'Not Yet Competent'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          ✕ Not Yet
                        </button>
                      </td>
                      <td className="p-3.5">
                        <input
                          type="text"
                          placeholder="Add comment or PoE reference..."
                          value={checklistComments[idx] || ''}
                          onChange={e => handleCommentChange(idx, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#002366]"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ASSESSOR'S OVERALL DECISION & SIGNATURES */}
      {activeTab === 'export' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4 space-y-1">
            <span className="text-xs text-[#002366] uppercase tracking-wider font-bold">
              Final Accreditation Decision
            </span>
            <h2 className="text-xl font-bold font-display text-[#002366]">
              Assessor's Overall RPL Decision & Signatures
            </h2>
            <p className="text-xs text-slate-600">
              Official moderation and sign-off for Christian Ministry Level 4 certification.
            </p>
          </div>

          {/* Decision Radio Options */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Select Assessment Outcome:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Competent – Full Qualification',
                'Competent – With Minor Gaps',
                'Further Evidence Required',
                'Not Yet Competent – Reassessment Required'
              ].map(opt => (
                <button
                  key={opt}
                  onClick={() => setOverallDecision(opt)}
                  className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                    overallDecision === opt
                      ? 'border-[#002366] bg-[#002366]/5 text-[#002366] font-bold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs">{opt}</span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    overallDecision === opt ? 'border-[#002366] bg-[#002366]' : 'border-slate-300'
                  }`}>
                    {overallDecision === opt && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Assessor Comments */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Assessor's Comprehensive Comments:
            </label>
            <textarea
              rows={4}
              value={assessorGeneralComments}
              onChange={e => setAssessorGeneralComments(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-[#002366]"
            />
          </div>

          {/* Signatures & Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Candidate Signature</span>
              <div className="text-xs font-bold text-slate-800 font-serif italic border-b border-slate-300 pb-2">
                {candidateName}
              </div>
              <div className="text-[11px] text-slate-500">Date: {assessmentDate}</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Assessor Signature</span>
              <div className="text-xs font-bold text-[#002366] font-serif italic border-b border-slate-300 pb-2">
                {assessorName}
              </div>
              <div className="text-[11px] text-slate-500">Date: {assessmentDate}</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Internal Verifier</span>
              <input
                type="text"
                value={internalVerifier}
                onChange={e => setInternalVerifier(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs font-bold text-slate-800"
              />
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span>Date:</span>
                <input
                  type="date"
                  value={verifierDate}
                  onChange={e => setVerifierDate(e.target.value)}
                  className="bg-white border border-slate-200 rounded px-1 py-0.5 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              onClick={handlePrint}
              className="px-6 py-3 bg-[#002366] hover:bg-[#001A4D] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-[#C5A059]" />
              <span>Print Official RPL Report</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
