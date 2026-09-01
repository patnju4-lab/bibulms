import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Award, Plus, Search, CheckCircle2, XCircle, Trash2, Edit2, ShieldCheck, Printer, X } from 'lucide-react';
import { Certificate } from '../../../types';

export const CertificatesManagementTab: React.FC = () => {
  const { certificates, issueCertificate, updateCertificate, deleteCertificate, revokeCertificate, universityInfo } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isIssuing, setIsIssuing] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Form State
  const [studentName, setStudentName] = useState('Pastor David Emmanuel');
  const [studentId, setStudentId] = useState('BIBU-2024-ST-7492');
  const [degreeTitle, setDegreeTitle] = useState('Bachelor of Theology (B.Th)');
  const [schoolName, setSchoolName] = useState('School of Biblical & Theological Studies');
  const [honors, setHonors] = useState('Summa Cum Laude');

  const handleIssue = (e: React.FormEvent) => {
    e.preventDefault();
    const newCert = issueCertificate({
      studentName,
      studentId,
      degreeTitle,
      schoolName,
      honors,
      chancellorName: universityInfo.chancellor,
      registrarName: universityInfo.registrar
    });

    setNotification(`Degree Certificate ${newCert.certificateNumber} officially issued and recorded in Global Registry!`);
    setIsIssuing(false);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;

    updateCertificate(editingCert.id, {
      studentName,
      studentId,
      degreeTitle,
      schoolName,
      honors
    });

    setNotification(`Certificate ${editingCert.certificateNumber} updated successfully.`);
    setEditingCert(null);
    setTimeout(() => setNotification(null), 3500);
  };

  const filteredCerts = certificates.filter((c) =>
    c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.verificationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.degreeTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-[#002366] flex items-center gap-2">
            <Award className="w-5 h-5 text-[#C5A059]" />
            <span>Degree Conferrals & Verification Registry ({certificates.length})</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Issue official university credentials, maintain tamper-evident verification codes, and manage conferrals.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCert(null);
            setIsIssuing(true);
          }}
          className="px-4 py-2 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-bold uppercase tracking-wider border-2 border-[#C5A059] shadow flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-[#C5A059]" />
          <span>Issue New Degree</span>
        </button>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Issue / Edit Modal Form */}
      {(isIssuing || editingCert) && (
        <div className="bg-white rounded-xl border-2 border-[#002366] p-6 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-[#002366] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              <span>{isIssuing ? 'Confer Official Degree & Generate Verification Seal' : `Edit Credential: ${editingCert?.certificateNumber}`}</span>
            </h3>
            <button
              onClick={() => { setIsIssuing(false); setEditingCert(null); }}
              className="text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={isIssuing ? handleIssue : handleUpdate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Graduate Full Name</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student Matriculation ID</label>
                <input
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Conferred Degree Title</label>
                <input
                  type="text"
                  required
                  value={degreeTitle}
                  onChange={(e) => setDegreeTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Conferring Academic School</label>
                <input
                  type="text"
                  required
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Academic Honors / Distinction</label>
                <input
                  type="text"
                  value={honors}
                  onChange={(e) => setHonors(e.target.value)}
                  placeholder="Summa Cum Laude, Magna Cum Laude, or With Distinction"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => { setIsIssuing(false); setEditingCert(null); }}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#002366] text-white text-xs font-bold uppercase tracking-wider border border-[#C5A059]"
              >
                {isIssuing ? 'Confer & Register Credential' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search registry by Graduate Name, Certificate Number (BIBU-...), or Verification Code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-white shadow-xs focus:ring-2 focus:ring-[#002366]"
        />
      </div>

      {/* Certificates Registry Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#002366] text-white font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Certificate #</th>
                <th className="px-4 py-3">Graduate Name & ID</th>
                <th className="px-4 py-3">Degree & Honors</th>
                <th className="px-4 py-3">Conferral Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Verification Code</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredCerts.map((cert) => (
                <tr key={cert.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-[#002366]">
                    {cert.certificateNumber}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900">{cert.studentName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{cert.studentId}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-[#002366]">{cert.degreeTitle}</div>
                    {cert.honors && (
                      <span className="text-[10px] text-[#C5A059] font-bold">{cert.honors}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {cert.conferralDate}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      cert.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {cert.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[10px] text-slate-600">
                    {cert.verificationCode}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          setStudentName(cert.studentName);
                          setStudentId(cert.studentId);
                          setDegreeTitle(cert.degreeTitle);
                          setSchoolName(cert.schoolName);
                          setHonors(cert.honors || '');
                          setEditingCert(cert);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#002366] hover:bg-slate-100"
                        title="Edit Certificate"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {cert.status === 'Active' ? (
                        <button
                          onClick={() => {
                            if (window.confirm(`Revoke certificate ${cert.certificateNumber}?`)) {
                              revokeCertificate(cert.id, 'Administrative Review');
                            }
                          }}
                          className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50"
                          title="Revoke Certificate"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => updateCertificate(cert.id, { status: 'Active' })}
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                          title="Reactivate Certificate"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (window.confirm(`Delete certificate record for ${cert.studentName}?`)) {
                            deleteCertificate(cert.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
