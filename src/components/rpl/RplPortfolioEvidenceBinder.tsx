import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RPLApplicationRecord, RPLEvidenceItem } from '../../types/rpl';
import {
  FolderOpen,
  FileText,
  Award,
  CheckCircle2,
  Clock,
  ShieldCheck,
  User,
  Camera,
  BookOpen,
  Printer,
  Plus,
  Check,
  X,
  AlertCircle,
  FileCheck2,
  FileSpreadsheet
} from 'lucide-react';

export interface RplPortfolioEvidenceBinderProps {
  rplRecord?: RPLApplicationRecord;
  isAssessorView?: boolean;
}

export const RplPortfolioEvidenceBinder: React.FC<RplPortfolioEvidenceBinderProps> = ({
  rplRecord,
  isAssessorView = false
}) => {
  const { rplRecords, currentUser } = useApp();
  const record = rplRecord || rplRecords[0];

  const [activeSection, setActiveSection] = useState<'cover' | 'toc' | 'admission' | 'cat-assessments' | 'attachment' | 'verifier' | 'center'>('toc');
  const [selectedUnitCode, setSelectedUnitCode] = useState<string>('SWL-601');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Simulated POE items mirroring the TVET competency video guide
  const [poeSections, setPoeSections] = useState({
    traineeName: record?.applicantName || 'Anne Auma',
    admissionNumber: record?.applicationNumber || 'KTVC/RPL/2026/001',
    qualification: record?.desiredProgramName || 'Social Work and Community Development',
    qualificationLevel: 'Level 6 (Diploma Equivalent)',
    indexNumber: 'KTVC-IDX-99824',
    passportPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    admissionLetterUrl: '#',
    nationalIdUrl: '#',
    catAssessments: [
      { id: 'cat-1', title: 'CAT 1: Marked Script for Written Theory Assessment', score: 88, maxScore: 100, status: 'Verified', assessor: 'Dr. James Maina', date: '2026-03-15' },
      { id: 'cat-2', title: 'CAT 2: Practical Observation Checklist & Product Evaluation', score: 92, maxScore: 100, status: 'Verified', assessor: 'Prof. Sarah Omondi', date: '2026-04-10' },
      { id: 'cat-3', title: 'CAT 3: Critical-Point Practical Performance & Assessment', score: 95, maxScore: 100, status: 'Verified', assessor: 'Dr. James Maina', date: '2026-05-02' },
      { id: 'form-1', title: 'Formative Assessment 1: Continuous Field Log & Portfolio', score: 90, maxScore: 100, status: 'Verified', assessor: 'Mentor John Kiprop', date: '2026-05-20' }
    ],
    attachmentRecords: {
      trainerTraineeMentoring: 'Completed & Signed (Score: 94/100)',
      industryMentorTool: 'Completed by Industry Supervisor (Score: 96/100)',
      attachmentReports: 'Prepared by Trainee, Supervisor & Assessor (All Signed)',
      status: 'Fully Verified'
    },
    verifierFiles: {
      verifierReport: 'Internal Verifier Sample Audit Completed — No Discrepancies',
      feedbackToAssessors: 'Logged in Appendix 7 Validation Register',
      validationMinutes: 'Approved by Quality Assurance Board on 2026-06-01',
      memoValidationTools: 'Ref: BIBU/TVET/VAL/2026/04'
    },
    centerFiles: {
      meetingMinutes: 'Assessment Center Validation Minutes Filed',
      traineeList: 'Complete Cohort Roster (42 Candidates)'
    }
  });

  const handlePrintBinder = () => {
    window.print();
  };

  return (
    <div id="rpl-portfolio-evidence-binder-root" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#002366]/10 text-[#002366] text-xs font-bold uppercase tracking-wider">
            <FolderOpen className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>RPL Digital Portfolio of Evidence (POE) & e-Portfolio Binder</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-[#002366] mt-1">
            Competency-Based Education & Training (CBET) File Repository
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Trainee: <strong className="text-slate-900">{poeSections.traineeName}</strong> • Adm No: <strong className="text-slate-900 font-mono">{poeSections.admissionNumber}</strong> • Qualification: <strong className="text-slate-900">{poeSections.qualification}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintBinder}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer border border-slate-300 shadow-xs"
          >
            <Printer className="w-4 h-4 text-[#002366]" />
            <span>Print / Export POE Binder</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Table of Contents & Navigation */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-4">
          <div className="p-3 bg-[#002366] text-white rounded-xl space-y-1">
            <div className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059]">Physical / Digital Binder</div>
            <div className="text-sm font-bold font-display">{poeSections.traineeName}</div>
            <div className="text-xs font-mono text-slate-200">{poeSections.admissionNumber}</div>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 mb-1">
              Table of Contents (TOC)
            </div>

            <button
              onClick={() => setActiveSection('cover')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeSection === 'cover' ? 'bg-[#002366] text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>Cover & Spine Details</span>
              <span className="text-[10px] font-mono opacity-80">Spine</span>
            </button>

            <button
              onClick={() => setActiveSection('toc')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeSection === 'toc' ? 'bg-[#002366] text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>Table of Contents (Index)</span>
              <span className="text-[10px] font-mono opacity-80">Page 1</span>
            </button>

            <button
              onClick={() => setActiveSection('admission')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeSection === 'admission' ? 'bg-[#002366] text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>Label A: Passport Photo & Admission Docs</span>
              <span className="text-[10px] font-mono opacity-80">Section A</span>
            </button>

            <button
              onClick={() => setActiveSection('cat-assessments')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeSection === 'cat-assessments' ? 'bg-[#002366] text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>Label B: CATs, Formative & Marked Scripts</span>
              <span className="text-[10px] font-mono opacity-80">Section B</span>
            </button>

            <button
              onClick={() => setActiveSection('attachment')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeSection === 'attachment' ? 'bg-[#002366] text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>Label C: Industrial Attachment & Mentoring</span>
              <span className="text-[10px] font-mono opacity-80">Section C</span>
            </button>

            <button
              onClick={() => setActiveSection('verifier')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeSection === 'verifier' ? 'bg-[#002366] text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>Label D: Internal & External Verifier File</span>
              <span className="text-[10px] font-mono opacity-80">Section D</span>
            </button>

            <button
              onClick={() => setActiveSection('center')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeSection === 'center' ? 'bg-[#002366] text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>Label E: Assessment Center Records</span>
              <span className="text-[10px] font-mono opacity-80">Section E</span>
            </button>
          </div>
        </div>

        {/* Right Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          {/* SECTION: COVER & SPINE */}
          {activeSection === 'cover' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h3 className="text-base font-bold text-[#002366] uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#C5A059]" />
                  <span>Physical Binder Cover & Spine Label Spec</span>
                </h3>
                <span className="text-xs font-mono bg-blue-50 text-[#002366] px-2.5 py-1 rounded font-bold">
                  TVET Standard POE
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-900 text-white rounded-xl shadow-md space-y-3 relative overflow-hidden">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">Front Cover Label</div>
                  <div className="space-y-1 font-mono text-xs">
                    <div><strong>TRAINEE NAME:</strong> {poeSections.traineeName}</div>
                    <div><strong>ADMISSION NO:</strong> {poeSections.admissionNumber}</div>
                    <div><strong>QUALIFICATION:</strong> {poeSections.qualification}</div>
                    <div><strong>QUALIFICATION LEVEL:</strong> {poeSections.qualificationLevel}</div>
                    <div><strong>INDEX NUMBER:</strong> {poeSections.indexNumber}</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-900 text-white rounded-xl shadow-md space-y-3">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">Spine Label Tag</div>
                  <div className="space-y-1 font-mono text-xs">
                    <div><strong>Trainee:</strong> {poeSections.traineeName}</div>
                    <div><strong>Adm:</strong> {poeSections.admissionNumber}</div>
                    <div><strong>File Type:</strong> Portfolio of Evidence (POE)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: TABLE OF CONTENTS */}
          {activeSection === 'toc' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h3 className="text-base font-bold text-[#002366] uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#C5A059]" />
                  <span>Table of Contents (TOC) Index</span>
                </h3>
                <span className="text-xs text-slate-500 font-mono">Page 1 of Portfolio</span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Content Item Description</th>
                      <th className="p-3 text-center">Section / Label</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    <tr>
                      <td className="p-3">1. Trainee Passport Photo & Identification</td>
                      <td className="p-3 text-center font-mono font-bold text-[#002366]">Label A</td>
                      <td className="p-3 text-right text-emerald-700 font-bold">✓ Attached</td>
                    </tr>
                    <tr>
                      <td className="p-3">2. Admission Letter & Academic Certificates (KCPE/KCSE/Craft)</td>
                      <td className="p-3 text-center font-mono font-bold text-[#002366]">Label A</td>
                      <td className="p-3 text-right text-emerald-700 font-bold">✓ Attached</td>
                    </tr>
                    <tr>
                      <td className="p-3">3. CAT 1: Marked Written Theory Assessment Script (Out of 100)</td>
                      <td className="p-3 text-center font-mono font-bold text-[#002366]">Label B</td>
                      <td className="p-3 text-right text-emerald-700 font-bold">✓ Graded (88/100)</td>
                    </tr>
                    <tr>
                      <td className="p-3">4. CAT 2 & 3: Practical Observation & Product Checklists</td>
                      <td className="p-3 text-center font-mono font-bold text-[#002366]">Label B</td>
                      <td className="p-3 text-right text-emerald-700 font-bold">✓ Verified (92/100)</td>
                    </tr>
                    <tr>
                      <td className="p-3">5. Industrial Attachment Mentoring & Supervisor Reports</td>
                      <td className="p-3 text-center font-mono font-bold text-[#002366]">Label C</td>
                      <td className="p-3 text-right text-emerald-700 font-bold">✓ Signed</td>
                    </tr>
                    <tr>
                      <td className="p-3">6. Internal & External Verifier Audit & Minutes (Appendix 7)</td>
                      <td className="p-3 text-center font-mono font-bold text-[#002366]">Label D</td>
                      <td className="p-3 text-right text-emerald-700 font-bold">✓ Audited</td>
                    </tr>
                    <tr>
                      <td className="p-3">7. Assessment Center Validation Minutes & Trainee Roster</td>
                      <td className="p-3 text-center font-mono font-bold text-[#002366]">Label E</td>
                      <td className="p-3 text-right text-emerald-700 font-bold">✓ Filed</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION: ADMISSION & PASSPORT (LABEL A) */}
          {activeSection === 'admission' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h3 className="text-base font-bold text-[#002366] uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-[#C5A059]" />
                  <span>Section A: Passport Photo & Admission Documents</span>
                </h3>
                <span className="text-xs bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded font-bold">
                  Verified Identity
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div className="space-y-2 text-center">
                  <img
                    src={poeSections.passportPhoto}
                    alt="Trainee Passport"
                    className="w-32 h-32 object-cover rounded-xl mx-auto border-4 border-slate-200 shadow-sm"
                  />
                  <div className="text-xs font-bold text-slate-700">{poeSections.traineeName}</div>
                  <div className="text-[10px] text-slate-500 font-mono">Passport Size Photo</div>
                </div>

                <div className="sm:col-span-2 space-y-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <div className="font-bold text-[#002366]">Admission Letter Verification</div>
                    <p className="text-slate-600">Official institution admission letter issued for {poeSections.qualification}. Serial No: BIBU-ADM-2026-891.</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <div className="font-bold text-[#002366]">National ID / Passport Copy</div>
                    <p className="text-slate-600">Certified copy of National ID # 32918402 / Kenyan Passport verified by Admissions Registrar.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: CAT ASSESSMENTS & MARKED SCRIPTS (LABEL B) */}
          {activeSection === 'cat-assessments' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h3 className="text-base font-bold text-[#002366] uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#C5A059]" />
                  <span>Section B: CATs, Formative Assessments & Marked Scripts</span>
                </h3>
                <span className="text-xs font-mono bg-amber-50 text-amber-900 px-2.5 py-1 rounded font-bold">
                  Scored Out of 100
                </span>
              </div>

              <div className="space-y-3">
                {poeSections.catAssessments.map((cat) => (
                  <div key={cat.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-[#002366]">{cat.title}</div>
                      <div className="text-[11px] text-slate-500">
                        Assessor: {cat.assessor} • Date: {cat.date}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-black font-display text-emerald-700">
                          {cat.score} / {cat.maxScore}
                        </div>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {cat.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: ATTACHMENT & MENTORING (LABEL C) */}
          {activeSection === 'attachment' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h3 className="text-base font-bold text-[#002366] uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                  <span>Section C: Industrial Attachment & Mentoring Records</span>
                </h3>
                <span className="text-xs bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded font-bold">
                  Industry Verified
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="font-bold text-[#002366]">1. Trainer & Trainee Mentoring Tool</div>
                  <p className="text-slate-600">{poeSections.attachmentRecords.trainerTraineeMentoring}</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="font-bold text-[#002366]">2. Industry Mentor Mentoring Tool</div>
                  <p className="text-slate-600">{poeSections.attachmentRecords.industryMentorTool}</p>
                </div>
                <div className="sm:col-span-2 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="font-bold text-[#002366]">3. Attachment Supervisor & Assessor Reports</div>
                  <p className="text-slate-600">{poeSections.attachmentRecords.attachmentReports}</p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: VERIFIER FILES (LABEL D) */}
          {activeSection === 'verifier' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h3 className="text-base font-bold text-[#002366] uppercase tracking-wider flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-[#C5A059]" />
                  <span>Section D: Internal & External Verifier File</span>
                </h3>
                <span className="text-xs bg-blue-50 text-[#002366] px-2.5 py-0.5 rounded font-bold">
                  Appendix 7 Quality Audit
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="font-bold text-[#002366]">Verifier Report on Assessment</div>
                  <p className="text-slate-600">{poeSections.verifierFiles.verifierReport}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="font-bold text-[#002366]">Feedback to Assessors & Trainees in Sample Taken</div>
                  <p className="text-slate-600">{poeSections.verifierFiles.feedbackToAssessors}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="font-bold text-[#002366]">Validation Meeting Minutes & Reports (Appendix 7)</div>
                  <p className="text-slate-600">{poeSections.verifierFiles.validationMinutes}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="font-bold text-[#002366]">Memo Calling for Validation of Tools</div>
                  <p className="text-slate-600">{poeSections.verifierFiles.memoValidationTools}</p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: ASSESSMENT CENTER FILES (LABEL E) */}
          {activeSection === 'center' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h3 className="text-base font-bold text-[#002366] uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#C5A059]" />
                  <span>Section E: Assessment Center Files</span>
                </h3>
                <span className="text-xs bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded font-bold">
                  Center Compliance
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="font-bold text-[#002366]">Center Validation Meeting Minutes</div>
                  <p className="text-slate-600">{poeSections.centerFiles.meetingMinutes}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="font-bold text-[#002366]">Certified Candidate Roster / List of Trainees</div>
                  <p className="text-slate-600">{poeSections.centerFiles.traineeList}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
