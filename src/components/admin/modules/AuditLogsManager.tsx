import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Download,
  Shield,
  Clock,
  User,
  Server,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { AdminAuditLog } from '../../../types/admin';

interface AuditLogsManagerProps {
  logs: AdminAuditLog[];
}

export const AuditLogsManager: React.FC<AuditLogsManagerProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', 'Authentication', 'Academics', 'Honorary Senate', 'Curriculum', 'Examinations', 'Finance', 'System Security'];

  const filtered = logs.filter(l => {
    const matchesCat = categoryFilter === 'All' || l.category === categoryFilter;
    const matchesSearch =
      l.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.recordAffected.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.ipAddress.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleExport = () => {
    const headers = ['Timestamp', 'Administrator', 'Role', 'Action', 'Record Affected', 'IP Address', 'Category'];
    const rows = filtered.map(l => [
      l.timestamp,
      `"${l.user}"`,
      l.role,
      `"${l.action}"`,
      `"${l.recordAffected}"`,
      l.ipAddress,
      l.category
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `BIBU_Audit_Trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C5A059] uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" />
            <span>Immutable Institutional Governance & Compliance</span>
          </div>
          <h2 className="text-xl font-display font-black text-[#002366]">
            System Administration Audit Trail ({logs.length} Events)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically timestamped ledger of administrative access, grade modifications, certificate issuances, and enrollments.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export Audit Trail (CSV)</span>
        </button>
      </div>

      {/* Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit trail by administrator, action, affected record, or IP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-white"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-700 w-full sm:w-auto"
        >
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Administrator</th>
                <th className="p-3">Action Executed</th>
                <th className="p-3">Record Affected</th>
                <th className="p-3">Category</th>
                <th className="p-3">Security IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(l => (
                <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {l.timestamp.replace('T', ' ').slice(0, 19)}
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-[#002366] block">{l.user}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{l.role}</span>
                  </td>
                  <td className="p-3 font-semibold text-slate-800">{l.action}</td>
                  <td className="p-3 font-mono text-slate-700 text-[11px]">{l.recordAffected}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {l.category}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-[10px] text-slate-500">{l.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
