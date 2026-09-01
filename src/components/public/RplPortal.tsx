import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, CheckCircle2, FileText, Search, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { RPLApplication } from '../../types';

export const RplPortal: React.FC = () => {
  const { rplApplications, submitRPLApplication, programs } = useApp();

  const [lookupCode, setLookupCode] = useState('');
  const [foundRPL, setFoundRPL] = useState<RPLApplication | null>(null);
  const [lookupError, setLookupError] = useState('');
  const [submittedRPL, setSubmittedRPL] = useState<RPLApplication | null>(null);

  const [formData, setFormData] = useState({
    applicantName: '',
    email: '',
    phone: '',
    targetProgram: 'Bachelor of Christian Ministry (B.C.M)',
    yearsInMinistry: 10,
    ministryField: 'Pastoral Leadership & Church Planting',
    portfolioSummary: '',
    requestedCredits: 24,
    evidenceItems: [
      { title: '10-Year Ordination & Ministry Service Record', category: 'Ministry Experience', description: 'Certified pastoral appointment letters.' },
      { title: 'Sermon Audio & Teaching Series Archives', category: 'Teaching Portfolio', description: 'Expository sermon series recordings and discipleship outlines.' }
    ]
  });

  const handleLookup = () => {
    setLookupError('');
    setFoundRPL(null);
    if (!lookupCode.trim()) {
      setLookupError('Please enter an RPL reference number.');
      return;
    }
    const clean = lookupCode.trim().toUpperCase();
    const match = rplApplications.find(
      (r) => r.applicationNumber.toUpperCase() === clean || r.id.toUpperCase() === clean
    );
    if (match) {
      setFoundRPL(match);
    } else {
      setLookupError(`No RPL record found matching "${lookupCode}".`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = submitRPLApplication({
      applicantName: formData.applicantName || 'Candidate Minister',
      email: formData.email || 'minister@church.org',
      phone: formData.phone || '+1 (602) 555-0199',
      targetProgram: formData.targetProgram,
      yearsInMinistry: Number(formData.yearsInMinistry),
      ministryField: formData.ministryField,
      portfolioSummary: formData.portfolioSummary || 'Comprehensive pastoral shepherding, church planting, and evangelistic leadership.',
      evidenceItems: formData.evidenceItems,
      requestedCredits: Number(formData.requestedCredits)
    });
    setSubmittedRPL(result);
    window.scrollTo({ top: 50, behavior: 'smooth' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#C5A059] uppercase tracking-widest">
          <Award className="w-4 h-4 text-[#C5A059]" />
          <span>Academic Credit for Ministry Experience</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#002366]">
          Recognition of Prior Learning (RPL)
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          BIBU recognizes the profound value of active pulpit ministry, church planting, leadership, and field mission experience. Convert your ministerial service into accredited academic credits.
        </p>
      </div>

      {/* 4-Step RPL Workflow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-[#002366] text-[#C5A059] font-black flex items-center justify-center text-xs">
            01
          </div>
          <h3 className="text-sm font-display font-bold text-[#002366]">Portfolio Submission</h3>
          <p className="text-xs text-slate-600">
            Submit your ministry timeline, ordination certificates, sermon transcripts, and church growth reports.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-[#002366] text-[#C5A059] font-black flex items-center justify-center text-xs">
            02
          </div>
          <h3 className="text-sm font-display font-bold text-[#002366]">Academic Assessment</h3>
          <p className="text-xs text-slate-600">
            Our Faculty Assessors review your theological depth and practical leadership competencies against course rubrics.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-[#002366] text-[#C5A059] font-black flex items-center justify-center text-xs">
            03
          </div>
          <h3 className="text-sm font-display font-bold text-[#002366]">Credit Exemption</h3>
          <p className="text-xs text-slate-600">
            Up to 30-45% of program credit requirements may be awarded as course exemptions, drastically reducing study time.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-[#002366] text-[#C5A059] font-black flex items-center justify-center text-xs">
            04
          </div>
          <h3 className="text-sm font-display font-bold text-[#002366]">Fast-Track Graduation</h3>
          <p className="text-xs text-slate-600">
            Complete remaining core theological modules and earn your fully accredited degree certificate.
          </p>
        </div>
      </div>

      {/* Status Lookup */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
        <div className="text-xs font-bold text-[#002366] uppercase tracking-wider">
          Track Existing RPL Portfolio Assessment
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={lookupCode}
              onChange={(e) => setLookupCode(e.target.value)}
              placeholder="Enter RPL Number (e.g., BIBU-RPL-2026-104)"
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 bg-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#002366]"
            />
          </div>
          <button
            onClick={handleLookup}
            className="w-full sm:w-auto px-5 py-2 rounded-lg bg-[#002366] hover:bg-[#001A4D] text-white font-bold uppercase tracking-wider text-xs shadow-xs"
          >
            Check Assessment
          </button>
        </div>

        {lookupError && <div className="text-xs text-red-600">{lookupError}</div>}

        {foundRPL && (
          <div className="p-4 bg-[#F8F9FB] rounded-lg border border-slate-200 space-y-2 mt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#002366] font-display">{foundRPL.applicantName}</span>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#C5A059]/20 text-[#002366]">
                {foundRPL.status}
              </span>
            </div>
            <div className="text-xs text-slate-600">
              <strong>Target Degree:</strong> {foundRPL.targetProgram} • <strong>Years in Ministry:</strong> {foundRPL.yearsInMinistry}
            </div>
            {foundRPL.approvedCredits && (
              <div className="text-xs text-emerald-700 font-bold">
                ✓ Approved Course Exemption: {foundRPL.approvedCredits} Academic Credits Awarded!
              </div>
            )}
            {foundRPL.assessorNotes && (
              <div className="text-xs text-slate-600 bg-white p-2.5 rounded border border-slate-100 italic">
                "{foundRPL.assessorNotes}" — {foundRPL.assessorName}
              </div>
            )}
          </div>
        )}
      </div>

      {/* RPL Application Form */}
      {submittedRPL ? (
        <div className="bg-white rounded-xl border-2 border-[#C5A059] p-8 shadow-md text-center space-y-4 animate-in zoom-in-95">
          <div className="w-14 h-14 rounded-full bg-[#C5A059]/20 text-[#002366] mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-[#C5A059]" />
          </div>
          <h2 className="text-2xl font-display font-bold text-[#002366]">
            RPL Portfolio Submitted Successfully!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Your ministerial portfolio has been dispatched to the Dean of Academic Affairs for credit evaluation.
          </p>
          <div className="p-3 bg-[#F8F9FB] rounded-xl inline-block border border-slate-200">
            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Your RPL Reference Number:</div>
            <div className="text-lg font-mono font-bold text-[#002366]">{submittedRPL.applicationNumber}</div>
          </div>
          <div>
            <button
              onClick={() => setSubmittedRPL(null)}
              className="mt-2 px-6 py-2 rounded-lg bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-bold uppercase tracking-wider shadow"
            >
              Submit Another Portfolio
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-xl font-display font-bold text-[#002366]">
              Submit Recognition of Prior Learning (RPL) Application
            </h2>
            <p className="text-xs text-slate-500">
              Provide details of your pastoral service, evangelism crusade archives, or Christian leadership portfolio.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Applicant Full Name *</label>
              <input
                type="text"
                required
                value={formData.applicantName}
                onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                placeholder="e.g. Evangelist Marcus Davis"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#002366] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="m.davis@ministry.org"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#002366] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Target Academic Program *</label>
              <select
                value={formData.targetProgram}
                onChange={(e) => setFormData({ ...formData, targetProgram: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-[#002366] focus:outline-none"
              >
                {programs.map((p) => (
                  <option key={p.id} value={p.name}>
                    [{p.level}] {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Years in Active Ministry *</label>
              <input
                type="number"
                min="2"
                max="50"
                required
                value={formData.yearsInMinistry}
                onChange={(e) => setFormData({ ...formData, yearsInMinistry: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#002366] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Summary of Ministerial Portfolio & Church Accomplishments *</label>
            <textarea
              rows={4}
              required
              value={formData.portfolioSummary}
              onChange={(e) => setFormData({ ...formData, portfolioSummary: e.target.value })}
              placeholder="Describe your church planting history, sermon series authored, cross-cultural outreach, leadership training conducted, and pastoral counseling experience..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#002366] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 rounded-lg bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] font-black text-xs uppercase tracking-wider shadow transition-all"
          >
            Submit RPL Evaluation Request
          </button>
        </form>
      )}
    </div>
  );
};
