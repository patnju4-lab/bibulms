import React, { useState } from 'react';
import {
  UserCheck,
  Search,
  Download,
  GraduationCap,
  FileText,
  BadgeCheck,
  Building,
  Calendar,
  Filter
} from 'lucide-react';
import { PastStudentProfile, PastStudentStatus } from '../../../types/admin';

interface PastStudentsManagerProps {
  pastStudents: PastStudentProfile[];
  onLogAudit: (action: string, record: string, details?: string) => void;
}

export const PastStudentsManager: React.FC<PastStudentsManagerProps> = ({
  pastStudents,
  onLogAudit
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | PastStudentStatus>('All');
  const [selectedPastStudent, setSelectedPastStudent] = useState<PastStudentProfile | null>(pastStudents[0] || null);

  const filtered = pastStudents.filter(p => {
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesSearch =
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.award.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.alumniNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleExport = () => {
    const headers = ['Adm No', 'Full Name', 'Award', 'Status', 'Graduation Year', 'Cert No', 'Alumni No'];
    const rows = filtered.map(p => [
      p.admissionNumber,
      `"${p.fullName}"`,
      `"${p.award}"`,
      p.status,
      p.graduationYear || 'N/A',
      p.certificateNumber || 'N/A',
      p.alumniNumber || 'N/A'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `BIBU_Past_Students_Alumni_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onLogAudit('Exported Past Students & Alumni Records', `Count: ${filtered.length}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C5A059] uppercase tracking-wider mb-1">
            <UserCheck className="w-4 h-4" />
            <span>Alumni Relations & Past Students Archives</span>
          </div>
          <h2 className="text-xl font-display font-black text-[#002366]">
            Past Students & Alumni Registry ({pastStudents.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Graduated alumni, completed cohorts, conferred degree credentials, and historical institutional archives.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export Alumni Roll (CSV)</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search alumni name, admission #, award, cert #, or alumni ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-white"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-700 w-full sm:w-auto"
        >
          <option value="All">All Statuses ({pastStudents.length})</option>
          <option value="Graduated">Graduated</option>
          <option value="Completed">Completed</option>
          <option value="Deferred">Deferred</option>
          <option value="Withdrawn">Withdrawn</option>
          <option value="Suspended">Suspended</option>
          <option value="Transferred">Transferred</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">Admission / ID</th>
                <th className="p-3">Full Student Name</th>
                <th className="p-3">Conferred Award</th>
                <th className="p-3">Campus Hub</th>
                <th className="p-3">Year & Ceremony</th>
                <th className="p-3">Cert # / Alumni ID</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(stu => (
                <tr key={stu.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-mono font-bold text-[#002366]">{stu.admissionNumber}</td>
                  <td className="p-3 font-bold text-slate-800">{stu.fullName}</td>
                  <td className="p-3 text-slate-700 font-serif">{stu.award}</td>
                  <td className="p-3 text-slate-500">{stu.campus.split(' ')[0]}</td>
                  <td className="p-3 text-slate-600 font-mono">
                    {stu.graduationYear} • {stu.ceremonyName.split(' ')[0]}
                  </td>
                  <td className="p-3 font-mono text-slate-700">
                    <span className="block text-[10px] text-emerald-700 font-bold">{stu.certificateNumber}</span>
                    <span className="text-[10px] text-slate-400">{stu.alumniNumber}</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      stu.status === 'Graduated' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {stu.status}
                    </span>
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
