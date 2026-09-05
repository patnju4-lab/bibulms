import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, CheckCircle2, FileText, Search, Sparkles, ArrowRight, ShieldCheck, BookOpen, UserCheck, HelpCircle, Layers } from 'lucide-react';
import { RPLApplication } from '../../types';
import { RplSlideDeck } from '../rpl/RplSlideDeck';

export const RplPortal: React.FC = () => {
  const { rplApplications, submitRPLApplication, programs, verifyRPLCode } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'slides' | 'eligibility' | 'mapping' | 'faq' | 'verify'>('overview');

  // Lookup state
  const [verifyInput, setVerifyInput] = useState('');
  const [verifiedRecord, setVerifiedRecord] = useState<any>(null);
  const [verifyError, setVerifyError] = useState('');

  // Eligibility Quiz State
  const [quizForm, setQuizForm] = useState({
    name: '',
    email: '',
    role: 'Senior Pastor',
    years: 8,
    program: 'Bachelor of Theology (B.Th)',
    hasEvidence: 'Yes'
  });
  const [quizResult, setQuizResult] = useState<any>(null);

  // Application Form State
  const [formData, setFormData] = useState({
    applicantName: '',
    email: '',
    phone: '',
    targetProgram: 'Bachelor of Theology (B.Th)',
    yearsInMinistry: 8,
    ministryField: 'Pastoral Leadership & Church Planting',
    portfolioSummary: '',
    requestedCredits: 24
  });
  const [submittedSuccess, setSubmittedSuccess] = useState<string | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError('');
    setVerifiedRecord(null);
    if (!verifyInput.trim()) {
      setVerifyError('Please enter a valid RPL verification code or application number.');
      return;
    }
    const match = verifyRPLCode(verifyInput);
    if (match) {
      setVerifiedRecord(match);
    } else {
      setVerifyError(`No verified RPL record found matching "${verifyInput}".`);
    }
  };

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const score = quizForm.years >= 5 && quizForm.hasEvidence === 'Yes' ? 'Potentially Eligible' : 'Additional Evidence Required';
    setQuizResult({
      status: score,
      estimatedCredits: quizForm.years >= 8 ? '18–36 Credits' : '12–24 Credits',
      recommendation: 'Your profile demonstrates significant ministry background. We recommend initiating a formal RPL portfolio submission.'
    });
  };

  const handleSubmitApp = (e: React.FormEvent) => {
    e.preventDefault();
    const res = submitRPLApplication({
      applicantName: formData.applicantName || 'Candidate Minister',
      email: formData.email || 'minister@bibu.edu',
      phone: formData.phone || '+1 (602) 555-0199',
      targetProgram: formData.targetProgram,
      yearsInMinistry: Number(formData.yearsInMinistry),
      ministryField: formData.ministryField,
      portfolioSummary: formData.portfolioSummary || 'Extensive pastoral service and church ministry leadership.',
      evidenceItems: [
        { title: 'Ministerial Ordination & Service Record', category: 'Ministry Experience', description: 'Certified ordination papers.' }
      ],
      requestedCredits: Number(formData.requestedCredits)
    });
    setSubmittedSuccess(res.applicationNumber);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#002366] to-[#001A4D] text-white rounded-2xl p-8 sm:p-12 shadow-lg space-y-6 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Award className="w-64 h-64 text-[#C5A059]" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 text-[#C5A059] text-xs font-black uppercase tracking-widest">
          <Sparkles className="w-4 h-4 text-[#C5A059]" />
          <span>Breakthrough International Bible University • Phoenix, AZ</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-display font-bold text-white max-w-3xl mx-auto leading-tight">
          Your Ministry Experience Has Academic Value.
        </h1>

        <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
          Convert your ministerial service into recognized academic credit through a transparent, evidence-based Recognition of Prior Learning (RPL) process.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setActiveTab('slides')}
            className="px-6 py-3 rounded-xl bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
          >
            <Award className="w-4 h-4" />
            <span>Proposed Slide Deck (15 Slides)</span>
          </button>
          <button
            onClick={() => setActiveTab('eligibility')}
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-xs border border-white/20 transition-all"
          >
            Check Eligibility Now
          </button>
          <button
            onClick={() => setActiveTab('verify')}
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-xs border border-white/20 transition-all"
          >
            Verify RPL Credential
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'overview', label: 'Overview & Process' },
          { id: 'slides', label: 'Proposed Slide Deck (15 Slides)' },
          { id: 'eligibility', label: 'Eligibility Quiz' },
          { id: 'mapping', label: 'Experience Mapping' },
          { id: 'faq', label: 'Frequently Asked Questions' },
          { id: 'verify', label: 'Public Verification' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#002366] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB: PROPOSED SLIDE DECK (15 SLIDES) */}
      {activeTab === 'slides' && (
        <div className="space-y-6 animate-in fade-in">
          <RplSlideDeck />
        </div>
      )}

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-10 animate-in fade-in">
          {/* Slide Deck Featured Callout Banner */}
          <div className="bg-gradient-to-r from-[#001744] via-[#002366] to-[#0A3078] rounded-2xl p-6 sm:p-8 text-white border-2 border-[#C5A059] shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 text-[#C5A059] text-[10px] font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Candidate Scoping Resource</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-black text-white">
                RPL Proposed Slide Deck — 15 Official Slides
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
                Review the comprehensive presentation covering the Purpose of RPL Counselling, the 5 Quality Standards of Evidence (A.R.S.C.V.), Pastoral &amp; Sermon Artifacts, Reflective Writing, Competencies, and the Master Evidence Register.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('slides')}
              className="px-6 py-3.5 rounded-xl bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-2 shrink-0"
            >
              <span>Launch Presentation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#002366] text-[#C5A059] flex items-center justify-center font-bold">01</div>
              <h3 className="text-base font-display font-bold text-[#002366]">What is RPL?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Recognition of Prior Learning is a rigorous academic assessment through which active ministers, pastors, and church planters have their experiential learning evaluated against BIBU learning outcomes.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#002366] text-[#C5A059] flex items-center justify-center font-bold">02</div>
              <h3 className="text-base font-display font-bold text-[#002366]">What RPL is NOT</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                RPL is <strong className="text-slate-900">not automatic credit</strong>, not a purchase of a degree, and not a shortcut that bypasses academic standards. Experience alone does not generate credit without verified evidence.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#002366] text-[#C5A059] flex items-center justify-center font-bold">03</div>
              <h3 className="text-base font-display font-bold text-[#002366]">Core Principle</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-mono font-bold text-[#002366]">
                EXPERIENCE → EVIDENCE → ASSESSMENT → VERIFICATION → ACADEMIC DECISION → CREDIT
              </p>
            </div>
          </div>

          {/* Quick Submit Form */}
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-xl font-display font-bold text-[#002366]">
                Initiate Your RPL Assessment Request
              </h2>
              <p className="text-xs text-slate-500">
                Submit your ministerial profile to start your evaluation with the BIBU Academic Senate.
              </p>
            </div>

            {submittedSuccess ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-[#002366]">RPL Portfolio Submitted Successfully!</h3>
                <p className="text-xs text-slate-600">Your application number is <strong className="font-mono">{submittedSuccess}</strong>. You can track this in your Student Portal or verify it on our public checker.</p>
                <button
                  onClick={() => setSubmittedSuccess(null)}
                  className="px-5 py-2 rounded-lg bg-[#002366] text-white text-xs font-bold"
                >
                  Submit Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitApp} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.applicantName}
                      onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                      placeholder="e.g. Pastor Samuel Okonkwo"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="s.okonkwo@church.org"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Target Degree Program *</label>
                    <select
                      value={formData.targetProgram}
                      onChange={(e) => setFormData({ ...formData, targetProgram: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#002366]"
                    >
                      {programs.map((p) => (
                        <option key={p.id} value={p.name}>[{p.level}] {p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Years in Ministry *</label>
                    <input
                      type="number"
                      min="2"
                      max="40"
                      required
                      value={formData.yearsInMinistry}
                      onChange={(e) => setFormData({ ...formData, yearsInMinistry: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Summary of Ministry Experience *</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.portfolioSummary}
                    onChange={(e) => setFormData({ ...formData, portfolioSummary: e.target.value })}
                    placeholder="Briefly describe your pulpit preaching, church leadership, or mission field achievements..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-8 py-3 rounded-lg bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] font-black text-xs uppercase tracking-wider shadow"
                >
                  Submit RPL Application
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ELIGIBILITY QUIZ */}
      {activeTab === 'eligibility' && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs space-y-6 animate-in fade-in max-w-2xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-display font-bold text-[#002366]">RPL Eligibility Screening Quiz</h2>
            <p className="text-xs text-slate-600">Answer a few questions to get an immediate preliminary estimate of your prior learning potential.</p>
          </div>

          <form onSubmit={handleQuizSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Your Ministry Role</label>
              <select
                value={quizForm.role}
                onChange={(e) => setQuizForm({ ...quizForm, role: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
              >
                <option value="Senior Pastor">Senior Pastor / Lead Pastor</option>
                <option value="Associate Pastor">Associate Pastor</option>
                <option value="Evangelist">Evangelist / Itinerant Preacher</option>
                <option value="Missionary">Global Missionary / Church Planter</option>
                <option value="Chaplain">Hospital / Military Chaplain</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Years in Active Pulpit / Field Ministry</label>
              <input
                type="number"
                min="1"
                max="40"
                value={quizForm.years}
                onChange={(e) => setQuizForm({ ...quizForm, years: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Do you have documentary evidence (Ordination papers, sermon manuscripts, church reports)?</label>
              <select
                value={quizForm.hasEvidence}
                onChange={(e) => setQuizForm({ ...quizForm, hasEvidence: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
              >
                <option value="Yes">Yes, readily available</option>
                <option value="Partial">Some evidence available</option>
                <option value="No">No formal documents</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-[#002366] text-white font-bold text-xs uppercase tracking-wider shadow"
            >
              Generate Preliminary Estimate
            </button>
          </form>

          {quizResult && (
            <div className="p-5 bg-[#F8F9FB] border border-slate-200 rounded-xl space-y-2 animate-in zoom-in-95">
              <div className="text-xs font-bold text-[#002366] uppercase">Preliminary Screening Outcome:</div>
              <div className="text-lg font-bold text-emerald-700">{quizResult.status}</div>
              <div className="text-xs text-slate-700"><strong>Estimated Potential:</strong> {quizResult.estimatedCredits}</div>
              <p className="text-xs text-slate-600">{quizResult.recommendation}</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MAPPING */}
      {activeTab === 'mapping' && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs space-y-6 animate-in fade-in">
          <h2 className="text-2xl font-display font-bold text-[#002366]">Ministry-to-Academic-Credit Mapping Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-[#F8F9FB] border border-slate-200 space-y-2">
              <h3 className="text-sm font-bold text-[#002366]">Pastoral Ministry</h3>
              <p className="text-xs text-slate-600">5+ years pastoral experience maps to:</p>
              <ul className="text-xs text-slate-700 list-disc pl-4 space-y-1">
                <li>Pastoral Theology</li>
                <li>Biblical Counseling</li>
                <li>Church Governance</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-[#F8F9FB] border border-slate-200 space-y-2">
              <h3 className="text-sm font-bold text-[#002366]">Church Planting</h3>
              <p className="text-xs text-slate-600">Established new congregations maps to:</p>
              <ul className="text-xs text-slate-700 list-disc pl-4 space-y-1">
                <li>Global Evangelism & Missions</li>
                <li>Apostolic Church Planting</li>
                <li>Christian Leadership</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-[#F8F9FB] border border-slate-200 space-y-2">
              <h3 className="text-sm font-bold text-[#002366]">Preaching & Teaching</h3>
              <p className="text-xs text-slate-600">Regular pulpit delivery maps to:</p>
              <ul className="text-xs text-slate-700 list-disc pl-4 space-y-1">
                <li>Expository Homiletics</li>
                <li>Biblical Hermeneutics</li>
                <li>Christian Education</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FAQ */}
      {activeTab === 'faq' && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs space-y-6 animate-in fade-in max-w-3xl mx-auto">
          <h2 className="text-2xl font-display font-bold text-[#002366]">Frequently Asked Questions</h2>
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-lg bg-[#F8F9FB] space-y-1">
              <strong className="text-[#002366] text-sm">Can my ministry experience earn academic credit?</strong>
              <p className="text-slate-600">Potentially, yes. Your learning must be demonstrated and assessed against relevant BIBU academic learning outcomes.</p>
            </div>
            <div className="p-4 rounded-lg bg-[#F8F9FB] space-y-1">
              <strong className="text-[#002366] text-sm">Does five years of ministry automatically equal academic credit?</strong>
              <p className="text-slate-600">No. Experience alone does not automatically generate credit. Evidence and competency assessment are mandatory.</p>
            </div>
            <div className="p-4 rounded-lg bg-[#F8F9FB] space-y-1">
              <strong className="text-[#002366] text-sm">Can I appeal an RPL decision?</strong>
              <p className="text-slate-600">Yes, BIBU provides a formal institutional appeals mechanism reviewed by the Academic Senate.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PUBLIC VERIFICATION */}
      {activeTab === 'verify' && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs space-y-6 animate-in fade-in max-w-xl mx-auto">
          <div className="text-center space-y-2">
            <ShieldCheck className="w-12 h-12 text-[#C5A059] mx-auto" />
            <h2 className="text-2xl font-display font-bold text-[#002366]">Public RPL Credential Verification</h2>
            <p className="text-xs text-slate-600">Enter an official RPL verification code (e.g. VRPL-78921-AZ) or application number.</p>
          </div>

          <form onSubmit={handleVerify} className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={verifyInput}
                onChange={(e) => setVerifyInput(e.target.value)}
                placeholder="BIBU-RPL-2026-000101 or VRPL-78921-AZ"
                className="w-full pl-9 pr-4 py-2.5 text-xs rounded-lg border border-slate-300 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#002366]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#002366] text-white font-bold text-xs uppercase tracking-wider shadow"
            >
              Verify Credential
            </button>
          </form>

          {verifyError && <div className="text-xs text-red-600 text-center">{verifyError}</div>}

          {verifiedRecord && (
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 animate-in zoom-in-95">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 font-mono">{verifiedRecord.applicationNumber}</span>
                <span className="text-[10px] font-black bg-emerald-700 text-white px-2 py-0.5 rounded">VERIFIED VALID</span>
              </div>
              <div className="text-xs text-slate-800">
                <strong>Candidate:</strong> {verifiedRecord.applicantName}<br/>
                <strong>Program:</strong> {verifiedRecord.desiredProgramName}<br/>
                <strong>Status:</strong> {verifiedRecord.status}<br/>
                <strong>Credits Conferred:</strong> {verifiedRecord.approvedCredits} Academic Credits
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
