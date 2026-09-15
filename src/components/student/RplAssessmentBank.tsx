import React, { useState } from 'react';
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

export interface RplAssessmentBankProps {
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
      'What evidence in your Portfolio of Evidence supports your answers?'
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

export const RplAssessmentBank: React.FC<RplAssessmentBankProps> = ({
  onClose,
  candidateNameDefault = 'Rev. David Kariuki',
  assessorNameDefault = 'Dr. Samuel Mwangi (Principal Assessor)'
}) => {
  const [activeTab, setActiveTab] = useState<'modules' | 'crosscutting' | 'tracker'>('modules');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('chaplaincy');

  // Candidate Self-Preparation Tracker State: { [key]: boolean }
  const [preparedQuestions, setPreparedQuestions] = useState<Record<string, boolean>>({});
  const [candidateNotes, setCandidateNotes] = useState<Record<string, string>>({});
  const [checkedCriteria, setCheckedCriteria] = useState<Record<string, boolean>>({});

  const toggleQuestionPrepared = (key: string) => {
    setPreparedQuestions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleCriteriaChecked = (key: string) => {
    setCheckedCriteria(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const activeModule = MODULES.find(m => m.id === selectedModuleId) || MODULES[0];

  const handlePrint = () => {
    window.print();
  };

  // Compute readiness stats
  const totalOralCount = MODULES.reduce((acc, m) => acc + m.oralQuestions.length, 0) + CROSS_CUTTING_QUESTIONS.length;
  const preparedOralCount = Object.values(preparedQuestions).filter(Boolean).length;
  const oralProgressPct = Math.round((preparedOralCount / totalOralCount) * 100);

  return (
    <div id="rpl-assessment-bank-portal" className="bg-slate-50 min-h-screen p-4 sm:p-8 space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#002366] via-[#001A4D] to-[#001233] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900/45">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#C5A059] text-[#002366] text-xs font-black uppercase tracking-widest shadow-xs">
                Student RPL Portal
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-mono font-semibold">
                Christian Ministry Level 4
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
              Oral & Practical RPL Assessment Question Bank
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-3xl">
              Review competency standards, prepare your responses, draft your portfolio evidence notes, and track your readiness for your TVET assessor oral and practical evaluation.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-white/20 flex items-center gap-2 shadow-xs"
            >
              <Printer className="w-4 h-4 text-[#C5A059]" />
              <span>Print Study Guide</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2.5 bg-[#C5A059] hover:bg-[#b28d4a] text-[#002366] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                <span>Close Portal</span>
              </button>
            )}
          </div>
        </div>

        {/* PROGRESS BAR SUMMARY */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10 text-xs">
          <div className="bg-white/10 p-4 rounded-xl border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">Oral Prep Readiness</span>
              <div className="text-xl font-bold font-display text-white">{preparedOralCount} / {totalOralCount} Qs Prepared</div>
            </div>
            <div className="text-[#C5A059] font-mono text-lg font-bold">{oralProgressPct}%</div>
          </div>
          <div className="bg-white/10 p-4 rounded-xl border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">Core Units Enrolled</span>
              <div className="text-xl font-bold font-display text-white">6 Ministry Modules</div>
            </div>
            <BookOpen className="w-6 h-6 text-[#C5A059]" />
          </div>
          <div className="bg-white/10 p-4 rounded-xl border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">Evidence Standard</span>
              <div className="text-xs font-bold text-emerald-300">Sufficient, Valid & Current</div>
            </div>
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
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
          <span>6 Core Modules & Practice Questions</span>
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
          onClick={() => setActiveTab('tracker')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'tracker'
              ? 'bg-[#002366] text-[#C5A059] shadow-sm font-black'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CheckSquare className="w-4 h-4 text-[#C5A059]" />
          <span>Observation Criteria Checklist</span>
        </button>
      </div>

      {/* TAB 1: MODULES & ORAL PRACTICE */}
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
                const modQKeys = mod.oralQuestions.map((_, i) => `${mod.id}-q-${i}`);
                const modPrepCount = modQKeys.filter(k => preparedQuestions[k]).length;
                const isModReady = modPrepCount === mod.oralQuestions.length;

                return (
                  <button
                    key={mod.id}
                    onClick={() => setSelectedModuleId(mod.id)}
                    className={`w-full text-left p-3.5 rounded-xl transition-all flex flex-col space-y-1.5 ${
                      isSelected
                        ? 'bg-[#002366] text-white shadow-md border-l-4 border-[#C5A059]'
                        : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono opacity-80">
                      <span>{mod.code}</span>
                      <span className={isModReady ? 'text-emerald-400 font-bold' : ''}>
                        {modPrepCount}/{mod.oralQuestions.length} Ready
                      </span>
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
                    Candidate Preparation & Self-Tracking
                  </span>
                </div>
                <h2 className="text-xl font-bold font-display text-[#002366]">
                  {activeModule.title}
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeModule.description}
                </p>
              </div>

              {/* Oral Questions Practice Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold font-display text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#002366]" />
                    <span>A. Oral Questions & Candidate Notes ({activeModule.oralQuestions.length})</span>
                  </h3>
                  <span className="text-xs text-slate-500">Click checkbox when ready</span>
                </div>

                <div className="space-y-3">
                  {activeModule.oralQuestions.map((question, qIdx) => {
                    const qKey = `${activeModule.id}-q-${qIdx}`;
                    const isReady = !!preparedQuestions[qKey];

                    return (
                      <div
                        key={qIdx}
                        className={`p-4 rounded-xl border transition-all space-y-3 ${
                          isReady ? 'bg-emerald-50/40 border-emerald-200' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5 flex-1">
                            <span className="text-xs font-mono font-bold text-[#002366] bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                              Q{qIdx + 1}
                            </span>
                            <p className="text-xs font-semibold text-slate-900 leading-normal pt-0.5">
                              {question}
                            </p>
                          </div>

                          <button
                            onClick={() => toggleQuestionPrepared(qKey)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                              isReady
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{isReady ? 'Prepared ✓' : 'Mark Ready'}</span>
                          </button>
                        </div>

                        <div className="pt-2 border-t border-slate-200/60">
                          <textarea
                            rows={2}
                            placeholder="Draft your theological summary, ministry experience, or reference notes for this question..."
                            value={candidateNotes[qKey] || ''}
                            onChange={e => setCandidateNotes({ ...candidateNotes, [qKey]: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#002366]"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Practical Tasks Section */}
              <div className="space-y-4 pt-6 border-t border-slate-200">
                <h3 className="text-sm font-bold font-display text-slate-900 flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#002366]" />
                  <span>B. Practical Tasks & Assessor Observation Criteria</span>
                </h3>

                <div className="space-y-4">
                  {activeModule.practicalTasks.map((task, tIdx) => (
                    <div key={tIdx} className="p-5 rounded-2xl border border-slate-200 bg-blue-50/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#002366] uppercase tracking-wider">
                          Task {tIdx + 1}: {task.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-[#002366] font-semibold">
                          Practical Simulation
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 italic">
                        {task.description}
                      </p>

                      <div className="space-y-2 pt-2">
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          What Assessor Will Observe:
                        </div>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {task.observationCriteria.map((crit, cIdx) => {
                            const cKey = `${activeModule.id}-t-${tIdx}-c-${cIdx}`;
                            const isChecked = !!checkedCriteria[cKey];

                            return (
                              <li
                                key={cIdx}
                                onClick={() => toggleCriteriaChecked(cKey)}
                                className={`text-xs p-2.5 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                                  isChecked ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <CheckCircle2 className={`w-3.5 h-3.5 ${isChecked ? 'text-emerald-600' : 'text-slate-300'}`} />
                                  <span>{crit}</span>
                                </span>
                                <span className="text-[10px] font-mono text-slate-400">
                                  {isChecked ? 'Ready' : 'Review'}
                                </span>
                              </li>
                            );
                          })}
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
              Prepare your personal ministry testimonies and evidence references for these crucial cross-cutting questions.
            </p>
          </div>

          <div className="space-y-4">
            {CROSS_CUTTING_QUESTIONS.map((ccQ, idx) => {
              const ccKey = `cc-${idx}`;
              const isReady = !!preparedQuestions[ccKey];

              return (
                <div key={idx} className={`p-4 rounded-xl border transition-all space-y-2.5 ${
                  isReady ? 'bg-emerald-50/40 border-emerald-200' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-xs font-mono font-bold text-[#002366] bg-white px-2.5 py-1 rounded border border-slate-200 shrink-0">
                        CC-{idx + 1}
                      </span>
                      <p className="text-xs font-semibold text-slate-900 pt-0.5">
                        {ccQ}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleQuestionPrepared(ccKey)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                        isReady
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isReady ? 'Prepared ✓' : 'Mark Ready'}</span>
                    </button>
                  </div>

                  <div className="pl-9">
                    <textarea
                      rows={2}
                      placeholder="Draft your portfolio evidence reference and ministry story..."
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

      {/* TAB 3: OBSERVATION CRITERIA CHECKLIST */}
      {activeTab === 'tracker' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4 space-y-1">
            <span className="text-xs text-[#002366] uppercase tracking-wider font-bold">
              Competency Standards Matrix
            </span>
            <h2 className="text-xl font-bold font-display text-[#002366]">
              Practical RPL Observation Criteria Checklist
            </h2>
            <p className="text-xs text-slate-600">
              Track your self-assessment across all 12 TVET Level 4 performance indicators before your assessor evaluation.
            </p>
          </div>

          <div className="space-y-3">
            {CHECKLIST_ITEMS.map((item, idx) => {
              const chkKey = `chk-item-${idx}`;
              const isChecked = !!checkedCriteria[chkKey];

              return (
                <div
                  key={idx}
                  onClick={() => toggleCriteriaChecked(chkKey)}
                  className={`p-4 rounded-xl border flex items-center justify-between gap-4 cursor-pointer transition-all ${
                    isChecked ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-medium' : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                      isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-xs font-semibold">
                      {idx + 1}. {item}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    isChecked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isChecked ? 'Ready for Assessment' : 'Pending Review'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
