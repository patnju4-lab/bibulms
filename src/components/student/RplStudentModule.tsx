import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, CheckCircle2, Clock, FileText, Plus, ShieldCheck, Sparkles, User, ArrowRight, BookOpen } from 'lucide-react';
import { RPLApplicationRecord, RPLMinistryPosition, RPLEvidenceItem, RPLCompetencyItem } from '../../types/rpl';
import { RplSlideDeck } from '../rpl/RplSlideDeck';

export const RplStudentModule: React.FC = () => {
  const { currentUser, rplRecords, submitDetailedRPLApplication, submitRPLAppeal, programs } = useApp();

  const [activeView, setActiveView] = useState<'overview' | 'apply' | 'portfolio' | 'transcript' | 'slides'>('overview');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // New Application Form State
  const [targetProgramId, setTargetProgramId] = useState(programs[0]?.id || 'prog-bth-01');
  const [ministryRole, setMinistryRole] = useState('Senior Pastor');
  const [yearsMinistry, setYearsMinistry] = useState(10);
  const [churchName, setChurchName] = useState('Grace Covenant Fellowship');
  const [portfolioSummary, setPortfolioSummary] = useState('');

  // Find user's RPL records
  const myRecords = rplRecords.filter(r => r.studentId === currentUser.studentId || r.email === currentUser.email || r.userId === currentUser.id);
  const activeRecord = myRecords[0];

  const handleStartApplication = (e: React.FormEvent) => {
    e.preventDefault();
    const prog = programs.find(p => p.id === targetProgramId) || programs[0];

    const newRec = submitDetailedRPLApplication({
      studentId: currentUser.studentId || 'BIBU-STU-2026-9999',
      userId: currentUser.id,
      applicantName: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone || '+1 (602) 555-0199',
      country: 'United States',
      nationality: 'American',
      churchAffiliation: churchName,
      currentRole: ministryRole,
      yearsInMinistry: Number(yearsMinistry),
      highestAcademicLevel: 'Bachelor Degree',
      desiredProgramId: prog.id,
      desiredProgramName: prog.name,
      ministryPositions: [
        {
          id: 'pos-init',
          organization: churchName,
          positionTitle: ministryRole,
          startDate: '2015-01-01',
          endDate: 'Present',
          isCurrent: true,
          country: 'United States',
          cityLocation: 'Phoenix, AZ',
          responsibilities: portfolioSummary || 'Pulpit preaching, pastoral care, and discipleship leadership.',
          peopleServed: '300+ Members',
          leadershipScope: 'Senior Ministry Leader',
          pastoralDuties: 'Weekly expository teaching, prayer meetings, and pastoral counseling.'
        }
      ],
      competencies: [
        {
          id: 'cmp-1',
          learningOutcome: 'Expository sermon preparation and biblical hermeneutics.',
          courseCode: 'THEO-301',
          courseTitle: 'Biblical Hermeneutics & Exegesis',
          creditValue: 3,
          selfRating: 5,
          demonstrationMethod: 'Sermon outlines and pastoral portfolio.',
          assessorDecision: 'Pending'
        },
        {
          id: 'cmp-2',
          learningOutcome: 'Pastoral counseling and crisis shepherding.',
          courseCode: 'COUN-201',
          courseTitle: 'Biblical Counseling & Pastoral Care',
          creditValue: 3,
          selfRating: 4,
          demonstrationMethod: 'Pastoral care records and reference letters.',
          assessorDecision: 'Pending'
        }
      ],
      evidenceList: [
        {
          id: 'ev-1',
          title: 'Ordination & Ministerial License',
          classification: 'Direct Evidence',
          type: 'Ministry Ordination & Licenses',
          description: 'Official ordination certificate issued by presbytery.',
          fileName: 'ordination_certificate.pdf',
          verificationStatus: 'Pending'
        }
      ],
      reflectiveStatements: {
        callingAndPhilosophy: 'My ministerial call is anchored in faithful proclamation of the Word.',
        biblicalTheologicalGrowth: 'Committed to historical-grammatical exegesis.',
        pastoralLeadershipImpact: 'Equipping saints for works of service.',
        crossCulturalMissions: 'Active community outreach and missions support.'
      },
      references: [
        {
          id: 'ref-1',
          name: 'Bishop Arthur Sterling',
          roleTitle: 'Regional Presiding Bishop',
          organization: 'Christian Ministerial Fellowship',
          email: 'bishop.sterling@cmf.org',
          phone: '+1 (602) 555-8822',
          relationshipYears: 12,
          referenceLetterStatus: 'Received'
        }
      ],
      declarationConfirmed: true,
      digitalSignature: currentUser.name,
      requestedCredits: 12,
      potentialCreditsEstimated: 15,
      feeAmountUSD: 220,
      feeStatus: 'Paid',
      paymentReceiptNumber: 'BIBU-PAY-RPL-5510',
      assessorConflictDeclared: true,
      assessmentMethodsUsed: ['Portfolio assessment', 'Structured interview']
    });

    setSuccessMsg(`RPL Portfolio successfully created! Ref: ${newRec.applicationNumber}`);
    setActiveView('overview');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 py-6">
      {/* Header Banner */}
      <div className="bg-[#002366] text-white rounded-xl p-6 sm:p-8 border border-[#002366] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#C5A059]/20 text-[#C5A059] text-xs font-black uppercase tracking-wider">
              <Award className="w-4 h-4 text-[#C5A059]" />
              <span>Recognition of Prior Learning (RPL)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
              Academic Credit for Ministry Experience
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Convert your active pulpit ministry, church planting, and pastoral leadership into accredited academic credit toward your BIBU degree.
            </p>
          </div>

          <button
            onClick={() => setActiveView('apply')}
            className="px-5 py-2.5 rounded-lg bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] font-black text-xs uppercase tracking-wider shadow"
          >
            + Start RPL Application
          </button>
        </div>

        <div className="flex items-center gap-3 pt-3 border-t border-[#001A4D] text-xs text-slate-300">
          <span>Active Status: <strong className="text-white">{activeRecord ? activeRecord.status : 'No Active Portfolio'}</strong></span>
          <span>•</span>
          <span>Approved Credits: <strong className="text-[#C5A059]">{activeRecord ? activeRecord.approvedCredits : 0} Credits</strong></span>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
          {successMsg}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveView('overview')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeView === 'overview' ? 'bg-[#002366] text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
        >
          My RPL Dashboard
        </button>
        <button
          onClick={() => setActiveView('portfolio')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeView === 'portfolio' ? 'bg-[#002366] text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
        >
          Portfolio & Evidence Builder
        </button>
        <button
          onClick={() => setActiveView('slides')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${activeView === 'slides' ? 'bg-[#002366] text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
        >
          <Award className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Proposed Slide Deck (15 Slides)</span>
        </button>
        <button
          onClick={() => setActiveView('apply')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeView === 'apply' ? 'bg-[#002366] text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
        >
          New Application
        </button>
      </div>

      {activeView === 'slides' && (
        <div className="space-y-6 animate-in fade-in">
          <RplSlideDeck />
        </div>
      )}

      {activeView === 'overview' && (
        <div className="space-y-6">
          {myRecords.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-[#002366]">No RPL Applications Found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                You have not submitted a prior learning portfolio yet. Have you served in ministry, preaching, or church leadership? Apply for academic credit today.
              </p>
              <button
                onClick={() => setActiveView('apply')}
                className="px-6 py-2.5 rounded-lg bg-[#002366] text-white text-xs font-bold uppercase tracking-wider shadow"
              >
                Start Your RPL Assessment
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {myRecords.map((rec) => (
                <div key={rec.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#002366]">
                        <span>{rec.applicationNumber}</span>
                        <span>•</span>
                        <span className="text-[#C5A059]">{rec.verificationCode}</span>
                      </div>
                      <h3 className="text-xl font-display font-bold text-[#002366] mt-0.5">
                        {rec.desiredProgramName}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Submitted: {rec.submissionDate} • Status: <strong className="text-emerald-700">{rec.status}</strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-slate-500 font-bold uppercase">Credits Conferred</div>
                      <div className="text-2xl font-black font-display text-[#C5A059]">{rec.approvedCredits} / {rec.requestedCredits} Credits</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span>Assessment Workflow Progress</span>
                      <span>{rec.progressPercentage}% Complete</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-[#C5A059] h-2.5 rounded-full" style={{ width: `${rec.progressPercentage}%` }}></div>
                    </div>
                  </div>

                  {/* Competency Summary */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-[#002366] uppercase tracking-wider">
                      Assessed Competencies & Credit Awards
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {rec.competencies.map((comp) => (
                        <div key={comp.id} className="p-3.5 rounded-lg bg-[#F8F9FB] border border-slate-200 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <strong className="text-[#002366]">{comp.courseCode}: {comp.courseTitle}</strong>
                            <span className="font-bold text-emerald-700">{comp.awardedCredits || 0} Credits</span>
                          </div>
                          <p className="text-[11px] text-slate-600">{comp.learningOutcome}</p>
                          <div className="text-[10px] font-bold text-slate-500">Decision: {comp.assessorDecision}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Assessor Notes */}
                  {rec.assessorNotes && (
                    <div className="p-4 rounded-lg bg-[#002366]/5 border border-[#002366]/20 text-xs text-[#002366] space-y-1">
                      <strong>Assessor Notes ({rec.assessorName || 'Faculty Assessor'}):</strong>
                      <p className="italic">"{rec.assessorNotes}"</p>
                    </div>
                  )}

                  {rec.transcriptEntryConfirmed && (
                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Approved credits have been synchronized and recorded to your official BIBU Student Academic Transcript!</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeView === 'apply' && (
        <form onSubmit={handleStartApplication} className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-xl font-display font-bold text-[#002366]">
              Apply for Academic Credit for Ministry Experience
            </h2>
            <p className="text-xs text-slate-500">
              Fill in your ministerial credentials and experience scope for faculty evaluation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Target BIBU Academic Program *</label>
              <select
                value={targetProgramId}
                onChange={(e) => setTargetProgramId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#002366]"
              >
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.level}] {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Primary Ministry Role *</label>
              <input
                type="text"
                required
                value={ministryRole}
                onChange={(e) => setMinistryRole(e.target.value)}
                placeholder="e.g. Senior Pastor / Missionary"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Years of Active Ministry Experience *</label>
              <input
                type="number"
                min="2"
                max="50"
                required
                value={yearsMinistry}
                onChange={(e) => setYearsMinistry(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Current Church / Organization *</label>
              <input
                type="text"
                required
                value={churchName}
                onChange={(e) => setChurchName(e.target.value)}
                placeholder="e.g. Grace Fellowship Chapel"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Summary of Ministry Responsibilities & Achievements *</label>
            <textarea
              rows={4}
              required
              value={portfolioSummary}
              onChange={(e) => setPortfolioSummary(e.target.value)}
              placeholder="Describe your pulpit preaching frequency, pastoral care counseling, church planting history, leadership roles, and community outreach..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 rounded-lg bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] font-black text-xs uppercase tracking-wider shadow"
          >
            Submit RPL Application & Portfolio
          </button>
        </form>
      )}

      {activeView === 'portfolio' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <h3 className="text-lg font-display font-bold text-[#002366]">Portfolio & Evidence Document Builder</h3>
          <p className="text-xs text-slate-600">Upload ordination certificates, sermon manuscripts, church bylaws, and pastoral references to substantiate your prior learning.</p>

          <div className="p-6 rounded-xl border-2 border-dashed border-slate-300 bg-[#F8F9FB] text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-400 mx-auto" />
            <div className="text-xs font-bold text-slate-700">Drag & Drop Ministry Evidence Documents Here</div>
            <p className="text-[11px] text-slate-500">Supports PDF, DOCX, JPG, PNG up to 25MB with personal info redacted.</p>
            <button className="px-4 py-2 rounded-lg bg-[#002366] text-white text-xs font-bold uppercase tracking-wider shadow">
              Browse Files
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
