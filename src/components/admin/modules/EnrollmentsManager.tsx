import React, { useState } from 'react';
import {
  FileCheck,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Filter,
  Download,
  DollarSign
} from 'lucide-react';
import { AdminEnrollmentRecord, EnrollmentStatus } from '../../../types/admin';

interface EnrollmentsManagerProps {
  enrollments: AdminEnrollmentRecord[];
  onUpdateStatus: (id: string, status: EnrollmentStatus) => void;
  onLogAudit: (action: string, record: string, details?: string) => void;
}

export const EnrollmentsManager: React.FC<EnrollmentsManagerProps> = ({
  enrollments,
  onUpdateStatus,
  onLogAudit
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | EnrollmentStatus>('All');
  const [notification, setNotification] = useState<string | null>(null);

  const filtered = enrollments.filter(e => {
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
    const matchesSearch =
      e.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.campus.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (record: AdminEnrollmentRecord, newStatus: EnrollmentStatus) => {
    onUpdateStatus(record.id, newStatus);
    onLogAudit(`Updated Enrollment Status to ${newStatus}`, `${record.enrollmentNumber} (${record.studentName})`);
    setNotification(`Enrollment ${record.enrollmentNumber} transitioned to "${newStatus}".`);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C5A059] uppercase tracking-wider mb-1">
            <FileCheck className="w-4 h-4" />
            <span>Admissions & Enrollment Processing Pipeline</span>
          </div>
          <h2 className="text-xl font-display font-black text-[#002366]">
            Active Student Enrollments Workflow ({enrollments.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Admissions lifecycle: PENDING → APPROVED → ACTIVE → COMPLETED → GRADUATED.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-bold">
            Intake: 2026 Academic Cohorts
          </span>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search enrollment #, student name, program, or campus..."
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
          <option value="All">All Workflow States</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Graduated">Graduated</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">Enrollment #</th>
                <th className="p-3">Student Candidate</th>
                <th className="p-3">Academic Program</th>
                <th className="p-3">Campus Hub</th>
                <th className="p-3">Intake & Mode</th>
                <th className="p-3">Payment Status</th>
                <th className="p-3">Workflow Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(rec => (
                <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-mono font-bold text-[#002366]">{rec.enrollmentNumber}</td>
                  <td className="p-3 font-bold text-slate-800">{rec.studentName}</td>
                  <td className="p-3 text-slate-700 font-serif max-w-[200px] truncate">{rec.program}</td>
                  <td className="p-3 text-slate-500">{rec.campus.split(' ')[0]}</td>
                  <td className="p-3 text-slate-600 font-mono text-[11px]">
                    {rec.intake} • {rec.studyMode}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      rec.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                      rec.paymentStatus === 'Partial' ? 'bg-amber-100 text-amber-800' :
                      rec.paymentStatus === 'Scholarship' ? 'bg-purple-100 text-purple-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {rec.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      rec.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                      rec.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                      rec.status === 'Approved' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {rec.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {rec.status === 'Pending' && (
                        <button
                          onClick={() => handleStatusChange(rec, 'Approved')}
                          className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px]"
                        >
                          Approve
                        </button>
                      )}
                      {rec.status === 'Approved' && (
                        <button
                          onClick={() => handleStatusChange(rec, 'Active')}
                          className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px]"
                        >
                          Activate
                        </button>
                      )}
                      {rec.status === 'Active' && (
                        <button
                          onClick={() => handleStatusChange(rec, 'Completed')}
                          className="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px]"
                        >
                          Complete
                        </button>
                      )}
                      {rec.status === 'Completed' && (
                        <button
                          onClick={() => handleStatusChange(rec, 'Graduated')}
                          className="px-2 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px]"
                        >
                          Graduate
                        </button>
                      )}
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
