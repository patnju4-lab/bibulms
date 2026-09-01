import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UniversityLogo } from '../common/UniversityLogo';
import { Bulletin } from '../../types';
import { BulletinDetailModal } from '../public/BulletinDetailModal';
import {
  GraduationCap,
  BookOpen,
  FileCheck2,
  Award,
  Users,
  CheckCircle2,
  Clock,
  Send,
  Edit,
  MessageSquare,
  Sparkles,
  Search,
  Filter,
  Bell,
  Plus,
  Eye,
  Paperclip,
  ShieldCheck
} from 'lucide-react';
import { AssignmentSubmission, RPLApplication } from '../../types';

export const FacultyPortal: React.FC = () => {
  const {
    currentUser,
    courses,
    assignmentSubmissions,
    gradeAssignment,
    rplApplications,
    updateRPLStatus,
    bulletins,
    createBulletin,
    recordBulletinView
  } = useApp();

  const [activeTab, setActiveTab] = useState<'grading' | 'rpl' | 'bulletins' | 'courses' | 'roster'>('grading');

  // Bulletin Modal & Composer State
  const [activeBulletinModal, setActiveBulletinModal] = useState<Bulletin | null>(null);
  const [facultyDraftOpen, setFacultyDraftOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftCategory, setDraftCategory] = useState<Bulletin['category']>('Academic Notices');
  const [draftSummary, setDraftSummary] = useState('');
  const [draftContent, setDraftContent] = useState('');

  // Grading Modal / Selection
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null);
  const [gradeScore, setGradeScore] = useState<number>(92);
  const [gradeFeedback, setGradeFeedback] = useState<string>('Exemplary grammatical and historical exegesis. Excellent pastoral application to contemporary congregational life.');

  // RPL Assessment
  const [selectedRPL, setSelectedRPL] = useState<RPLApplication | null>(null);
  const [rplCredits, setRplCredits] = useState<number>(24);
  const [rplNotes, setRplNotes] = useState<string>('Candidate has demonstrated 10+ years of sound pastoral shepherding and church governance. Exemption approved for 24 credits.');

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;
    gradeAssignment(selectedSubmission.id, gradeScore, gradeFeedback, currentUser.name);
    setSelectedSubmission(null);
  };

  const handleRplApprove = () => {
    if (!selectedRPL) return;
    updateRPLStatus(selectedRPL.id, 'Approved', rplCredits, rplNotes, currentUser.name);
    setSelectedRPL(null);
  };

  const handleFacultySubmitBulletin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftTitle.trim() || !draftContent.trim()) return;

    createBulletin({
      title: draftTitle.trim(),
      category: draftCategory,
      department: currentUser.department || 'School of Biblical & Theological Studies',
      author: currentUser.name,
      authorRole: 'Academic Faculty / Instructor',
      priority: 'Important',
      targetAudience: 'Students',
      status: 'Published',
      summary: draftSummary.trim() || draftTitle.trim(),
      content: draftContent.trim()
    });

    setDraftTitle('');
    setDraftSummary('');
    setDraftContent('');
    setFacultyDraftOpen(false);
    alert('Academic notice published to University Gazette!');
  };

  const pendingAssignments = assignmentSubmissions.filter((s) => s.status === 'Submitted');
  const pendingRpl = rplApplications.filter((r) => r.status === 'Under Review');
  const facultyBulletins = bulletins.filter(b => b.status === 'Published');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Faculty Header */}
      <div className="bg-[#002366] text-white rounded-xl p-6 sm:p-8 border border-[#002366] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <UniversityLogo size="lg" withRing className="shadow-lg" />
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#C5A059]/20 text-[#C5A059] text-xs font-black uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-[#C5A059]" />
                <span>Faculty & Lecturer Command Center</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
                {currentUser.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Department: <strong className="text-[#C5A059]">{currentUser.department || 'School of Biblical & Theological Studies'}</strong> • Faculty ID: <span className="font-mono text-slate-200">FAC-PHX-8802</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#001A4D] border border-[#002366]/40 rounded-xl p-3 text-center min-w-[110px]">
              <div className="text-[10px] uppercase font-bold text-slate-300">Pending Papers</div>
              <div className="text-2xl font-black text-[#C5A059] font-display">{pendingAssignments.length}</div>
              <div className="text-[10px] text-[#C5A059]">Awaiting Grade</div>
            </div>

            <div className="bg-[#001A4D] border border-[#002366]/40 rounded-xl p-3 text-center min-w-[110px]">
              <div className="text-[10px] uppercase font-bold text-slate-300">RPL Portfolios</div>
              <div className="text-2xl font-black text-emerald-400 font-display">{pendingRpl.length}</div>
              <div className="text-[10px] text-emerald-300">For Assessment</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('grading')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'grading'
              ? 'border-[#002366] text-[#002366]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Assignment Grading Queue ({assignmentSubmissions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rpl')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'rpl'
              ? 'border-[#002366] text-[#002366]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>RPL Prior Learning Evaluation ({rplApplications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bulletins')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'bulletins'
              ? 'border-[#002366] text-[#002366]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Bell className="w-4 h-4 text-[#C5A059]" />
          <span>Academic Bulletins & Gazettes ({facultyBulletins.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'courses'
              ? 'border-[#002366] text-[#002366]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>My Assigned Courses</span>
        </button>

        <button
          onClick={() => setActiveTab('roster')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'roster'
              ? 'border-[#002366] text-[#002366]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Cohort Roster</span>
        </button>
      </div>

      {/* TAB 1: Grading Queue */}
      {activeTab === 'grading' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold font-display text-[#002366]">
                Student Paper & Exegetical Submissions
              </h2>
              <p className="text-xs text-slate-500">
                Review exegetical methods, biblical citations, and assign official letter grades and pastoral feedback.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F9FB] text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Assignment Title</th>
                  <th className="py-3 px-4">Submitted File</th>
                  <th className="py-3 px-4">Submission Date</th>
                  <th className="py-3 px-4 text-center">Grade</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assignmentSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#F8F9FB]">
                    <td className="py-3 px-4 font-bold text-slate-900 font-display">{sub.studentName}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{sub.assignmentTitle}</td>
                    <td className="py-3 px-4 text-[#002366] font-mono underline cursor-pointer">{sub.fileName}</td>
                    <td className="py-3 px-4 text-slate-500">{sub.submittedAt}</td>
                    <td className="py-3 px-4 text-center font-bold">
                      {sub.grade !== undefined ? (
                        <span className="text-emerald-700 font-bold font-display">{sub.grade} / 100 (A)</span>
                      ) : (
                        <span className="text-[#002366] font-black uppercase text-[10px] bg-[#C5A059]/20 px-2 py-0.5 rounded">Pending Grade</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedSubmission(sub);
                          if (sub.grade) setGradeScore(sub.grade);
                          if (sub.feedback) setGradeFeedback(sub.feedback);
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-[#002366] hover:bg-[#001A4D] text-white font-bold uppercase tracking-wider text-xs shadow-xs"
                      >
                        {sub.status === 'Graded' ? 'Edit Grade' : 'Grade Paper →'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: Faculty Bulletins & Academic Gazettes */}
      {activeTab === 'bulletins' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold font-display text-[#002366] flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#C5A059]" />
                <span>Academic Bulletins & Departmental Circulars</span>
              </h2>
              <p className="text-xs text-slate-500">
                Official notices published by the Academic Senate, Registrar, and Bible University Faculties.
              </p>
            </div>

            <button
              onClick={() => setFacultyDraftOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#002366] hover:bg-[#001438] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4 text-[#C5A059]" />
              <span>Draft Academic Notice</span>
            </button>
          </div>

          {/* Bulletins Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {facultyBulletins.map((b) => (
              <div
                key={b.id}
                onClick={() => {
                  recordBulletinView(b.id);
                  setActiveBulletinModal(b);
                }}
                className="bg-slate-50 border border-slate-200 hover:border-[#002366] rounded-xl p-4 flex flex-col justify-between cursor-pointer transition-all hover:shadow-md group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-mono font-bold text-[#002366]">{b.bulletinNumber}</span>
                    <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                      b.priority === 'Critical' ? 'bg-rose-100 text-rose-800' :
                      b.priority === 'Urgent' ? 'bg-amber-100 text-amber-900' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {b.priority}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-xs group-hover:text-[#002366] line-clamp-2 leading-snug">
                    {b.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {b.summary}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="truncate max-w-[140px] font-medium text-slate-600">{b.department}</span>
                  <span className="text-[#002366] font-bold group-hover:underline flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Read Notice
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Faculty Notice Composer Modal */}
      {facultyDraftOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="bg-[#002366] text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#C5A059]" />
                <span>Publish Departmental Academic Notice</span>
              </h3>
              <button
                onClick={() => setFacultyDraftOpen(false)}
                className="text-white hover:text-[#C5A059] font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFacultySubmitBulletin} className="p-6 space-y-4 text-xs text-slate-800">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. M.Div Exegetical Thesis Defense Submission Deadlines"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold focus:outline-none focus:ring-2 focus:ring-[#002366]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Category *</label>
                  <select
                    value={draftCategory}
                    onChange={(e) => setDraftCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    <option value="Academic Notices">Academic Notices</option>
                    <option value="Examinations & Assessments">Examinations & Assessments</option>
                    <option value="Graduation & Convocation">Graduation & Convocation</option>
                    <option value="Research & Publications">Research & Publications</option>
                    <option value="University News">University News</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Department</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.department || 'School of Biblical & Theological Studies'}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-100 font-medium text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Summary *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Brief summary for students and cohort dashboard..."
                  value={draftSummary}
                  onChange={(e) => setDraftSummary(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Detailed Content (Markdown Supported) *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Full instructions, reference passages, citation guidelines, and submission steps..."
                  value={draftContent}
                  onChange={(e) => setDraftContent(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#002366]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setFacultyDraftOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#002366] hover:bg-[#001438] text-white font-bold uppercase tracking-wider text-xs shadow-md"
                >
                  Publish Notice to University Gazette
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulletin Detail Modal */}
      {activeBulletinModal && (
        <BulletinDetailModal
          bulletin={activeBulletinModal}
          onClose={() => setActiveBulletinModal(null)}
        />
      )}

      {/* TAB 2: RPL Portfolios */}
      {activeTab === 'rpl' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold font-display text-[#002366]">
              Recognition of Prior Learning (RPL) Evaluation Registry
            </h2>
            <p className="text-xs text-slate-500">
              Evaluate field pastors and evangelists applying for advanced standing credits based on documented ministerial portfolios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rplApplications.map((rpl) => (
              <div key={rpl.id} className="p-5 rounded-xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#002366] font-display">{rpl.applicantName}</span>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                    rpl.status === 'Approved' ? 'bg-emerald-100 text-emerald-900' : 'bg-[#C5A059]/20 text-[#002366]'
                  }`}>
                    {rpl.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <div><strong>Target Degree:</strong> {rpl.targetProgram}</div>
                  <div><strong>Ministry Field:</strong> {rpl.ministryField} • <strong>Experience:</strong> {rpl.yearsInMinistry} Years</div>
                  <div className="line-clamp-2 italic text-slate-500">"{rpl.portfolioSummary}"</div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#C5A059]">
                    Requested: {rpl.requestedCredits} Credits
                  </span>

                  <button
                    onClick={() => {
                      setSelectedRPL(rpl);
                      if (rpl.approvedCredits) setRplCredits(rpl.approvedCredits);
                      if (rpl.assessorNotes) setRplNotes(rpl.assessorNotes);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#002366] text-white font-bold uppercase tracking-wider text-xs"
                  >
                    Assess Portfolio →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Faculty Courses */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((c) => (
            <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#002366]/10 text-[#002366] font-mono">
                  {c.code}
                </span>
                <span className="text-xs text-slate-500 font-bold">{c.creditHours} Credits</span>
              </div>
              <h3 className="text-base font-bold font-display text-[#002366]">{c.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-3">{c.description}</p>
              <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span>Passages: {c.biblePassages.join(', ')}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: Cohort Roster */}
      {activeTab === 'roster' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold font-display text-[#002366]">Enrolled Student Directory</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F9FB] text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Student ID</th>
                  <th className="py-2.5 px-3">Program</th>
                  <th className="py-2.5 px-3">Credits Earned</th>
                  <th className="py-2.5 px-3">GPA</th>
                  <th className="py-2.5 px-3">Standing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-[#F8F9FB]">
                  <td className="py-2.5 px-3 font-bold text-slate-900 font-display">Pastor David Emmanuel</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">BIBU-2024-ST-7492</td>
                  <td className="py-2.5 px-3 text-slate-800">Bachelor of Theology (B.Th)</td>
                  <td className="py-2.5 px-3 font-semibold text-[#002366]">78 / 120</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-700 font-display">3.84</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-semibold">Active (Dean's List)</td>
                </tr>
                <tr className="hover:bg-[#F8F9FB]">
                  <td className="py-2.5 px-3 font-bold text-slate-900 font-display">Sister Sarah Jenkins</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">BIBU-2025-ST-8104</td>
                  <td className="py-2.5 px-3 text-slate-800">Master of Divinity (M.Div)</td>
                  <td className="py-2.5 px-3 font-semibold text-[#002366]">36 / 72</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-700 font-display">3.92</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-semibold">Active</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grading Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold font-display text-[#002366]">
                  Grade Exegetical Submission
                </h3>
                <div className="text-xs text-slate-500">Student: <strong>{selectedSubmission.studentName}</strong></div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-[#F8F9FB] rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900">{selectedSubmission.assignmentTitle}</div>
                <div className="text-[11px] text-[#002366] font-mono mt-1">File: {selectedSubmission.fileName} ({selectedSubmission.fileSize})</div>
                <p className="mt-2 text-slate-600 italic">"{selectedSubmission.submissionText}"</p>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Score Awarded (out of 100 Points)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={gradeScore}
                  onChange={(e) => setGradeScore(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold focus:ring-2 focus:ring-[#002366] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Pastoral & Academic Feedback</label>
                <textarea
                  rows={4}
                  required
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  placeholder="Provide theological remarks, exegetical commendations, and areas for doctoral enrichment..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#002366] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-bold uppercase tracking-wider"
              >
                Cancel
              </button>

              <button
                onClick={handleGradeSubmit}
                className="px-6 py-2 rounded-lg bg-[#002366] hover:bg-[#001A4D] text-white font-bold uppercase tracking-wider text-xs shadow"
              >
                Post Official Grade
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RPL Assessment Modal */}
      {selectedRPL && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold font-display text-[#002366]">
                  Assess Ministerial RPL Portfolio
                </h3>
                <div className="text-xs text-slate-500">Applicant: <strong>{selectedRPL.applicantName}</strong></div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRPL(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-[#F8F9FB] rounded-xl border border-slate-200 space-y-1">
                <div><strong>Program:</strong> {selectedRPL.targetProgram}</div>
                <div><strong>Experience:</strong> {selectedRPL.yearsInMinistry} Years in {selectedRPL.ministryField}</div>
                <div><strong>Portfolio:</strong> {selectedRPL.portfolioSummary}</div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Academic Credits to Award (Course Exemption)</label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={rplCredits}
                  onChange={(e) => setRplCredits(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold focus:ring-2 focus:ring-[#002366] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Assessor's Evaluative Notes</label>
                <textarea
                  rows={3}
                  value={rplNotes}
                  onChange={(e) => setRplNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#002366] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedRPL(null)}
                className="px-4 py-2 rounded-lg text-slate-600 text-xs font-bold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={handleRplApprove}
                className="px-6 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold uppercase tracking-wider text-xs shadow"
              >
                Approve & Grant {rplCredits} Credits
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
