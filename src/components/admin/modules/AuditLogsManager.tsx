import React, { useState, useEffect } from 'react';
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
  CheckCircle2,
  Mail,
  Send,
  Globe,
  MapPin,
  BookOpen,
  AlertCircle,
  RefreshCw,
  Trash2,
  Copy,
  Check,
  Smartphone
} from 'lucide-react';
import { AdminAuditLog } from '../../../types/admin';
import {
  getStudentLoginAuditLogs,
  clearStudentLoginAuditLogs,
  sendStudentLoginNotification,
  StudentLoginAuditRecord
} from '../../../services/studentLoginNotificationService';
import { useApp } from '../../../context/AppContext';

interface AuditLogsManagerProps {
  logs: AdminAuditLog[];
}

export const AuditLogsManager: React.FC<AuditLogsManagerProps> = ({ logs }) => {
  const { allUsers, courses } = useApp();
  const [activeTab, setActiveTab] = useState<'system' | 'student-logins'>('student-logins');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Student login alerts state
  const [studentLogs, setStudentLogs] = useState<StudentLoginAuditRecord[]>([]);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testSentMessage, setTestSentMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setStudentLogs(getStudentLoginAuditLogs());
  }, []);

  const refreshStudentLogs = () => {
    setStudentLogs(getStudentLoginAuditLogs());
  };

  const handleClearStudentLogs = () => {
    if (window.confirm('Are you sure you want to clear the student login notification history?')) {
      clearStudentLoginAuditLogs();
      setStudentLogs([]);
    }
  };

  const handleTriggerTestNotification = async () => {
    setIsSendingTest(true);
    setTestSentMessage(null);

    // Pick first student or mock student
    const studentUser = allUsers.find(u => u.role === 'student') || {
      id: 'usr-student-test',
      name: 'Pastor David Emmanuel (Test Student)',
      email: 'david.emmanuel@student.bibu-edu.org',
      role: 'student' as const,
      country: 'United States',
      studentId: 'BIBU-2024-ST-7492',
      programName: 'Bachelor of Theology (B.Th)',
      enrolledCourseIds: ['crs-herm-301', 'crs-theo-201', 'crs-past-401']
    };

    try {
      const res = await sendStudentLoginNotification(studentUser, courses);
      refreshStudentLogs();
      setTestSentMessage(`✅ Login notification dispatched to panju4@gmail.com for ${studentUser.name}!`);
      setTimeout(() => setTestSentMessage(null), 7000);
    } catch (err: any) {
      setTestSentMessage(`⚠️ Dispatch triggered (Check log): ${err.message || 'Error'}`);
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleCopySummary = (record: StudentLoginAuditRecord) => {
    const text = `BIBU Student Login Notification
Recipient: ${record.recipientEmail}
Student: ${record.studentName} (${record.studentId})
Email: ${record.studentEmail}
Course/Program: ${record.program}
Enrolled Courses: ${record.courses.join(', ')}
Place: ${record.city}, ${record.region}, ${record.country}
Time: ${record.timestamp}
IP: ${record.ipAddress} (${record.timezone})
Status: ${record.deliveryStatus.toUpperCase()}`;
    navigator.clipboard.writeText(text);
    setCopiedId(record.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

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

  const filteredStudentLogs = studentLogs.filter(l => {
    const q = searchTerm.toLowerCase();
    return (
      l.studentName.toLowerCase().includes(q) ||
      l.studentId.toLowerCase().includes(q) ||
      l.studentEmail.toLowerCase().includes(q) ||
      l.country.toLowerCase().includes(q) ||
      l.city.toLowerCase().includes(q) ||
      l.program.toLowerCase().includes(q)
    );
  });

  const handleExportSystemLogs = () => {
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

  const handleExportStudentLoginLogs = () => {
    const headers = ['Timestamp', 'Student Name', 'Student ID', 'Email', 'Country', 'City/Region', 'Program', 'Courses', 'IP', 'Recipient', 'Delivery Status'];
    const rows = filteredStudentLogs.map(l => [
      l.timestamp,
      `"${l.studentName}"`,
      `"${l.studentId}"`,
      l.studentEmail,
      `"${l.country}"`,
      `"${l.city}, ${l.region}"`,
      `"${l.program}"`,
      `"${l.courses.join('; ')}"`,
      l.ipAddress,
      l.recipientEmail,
      l.deliveryStatus
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `BIBU_Student_Login_Alerts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C5A059] uppercase tracking-wider mb-1">
              <Shield className="w-4 h-4" />
              <span>Institutional Governance, Security & Login Dispatch</span>
            </div>
            <h2 className="text-xl font-display font-black text-[#002366]">
              Audit Trail & Student Login Monitor
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated notifications to <span className="font-mono font-bold text-[#002366]">panju4@gmail.com</span> upon student authentication with geolocation, country, time & course tracking.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'student-logins' ? (
              <>
                <button
                  onClick={handleTriggerTestNotification}
                  disabled={isSendingTest}
                  className="px-3.5 py-2 rounded-xl bg-[#002366] hover:bg-[#001845] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
                  title="Test sending an immediate login alert email to panju4@gmail.com"
                >
                  <Send className={`w-3.5 h-3.5 ${isSendingTest ? 'animate-pulse' : ''}`} />
                  <span>{isSendingTest ? 'Sending Alert...' : 'Send Test Alert to panju4@gmail.com'}</span>
                </button>
                <button
                  onClick={handleExportStudentLoginLogs}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export CSV</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleExportSystemLogs}
                className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span>Export Audit Trail (CSV)</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
          <button
            onClick={() => setActiveTab('student-logins')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'student-logins'
                ? 'bg-[#002366] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Student Login Email Alerts ({studentLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'system'
                ? 'bg-[#002366] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>System Administrative Audit ({logs.length})</span>
          </button>
        </div>
      </div>

      {testSentMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{testSentMessage}</span>
        </div>
      )}

      {/* STUDENT LOGINS TAB */}
      {activeTab === 'student-logins' && (
        <div className="space-y-4">
          {/* Information & Configuration Banner */}
          <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 text-[#002366] rounded-xl shrink-0 mt-0.5">
                <Mail className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="font-bold text-[#002366] flex items-center gap-2">
                  <span>Student Login Notification Destination:</span>
                  <span className="font-mono bg-blue-100 text-blue-900 px-2 py-0.5 rounded text-[11px]">
                    panju4@gmail.com
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">(CC: patnju4@gmail.com)</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Whenever any student logs into their BIBU portal, an automated email dispatch is sent containing:
                  <strong> Student Full Details</strong>, <strong>Enrolled Course & Degree Program</strong>, <strong>Place of Login (City & Region)</strong>, <strong>Country</strong>, <strong>Login Time</strong>, and <strong>IP Address</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
              <button
                onClick={refreshStudentLogs}
                className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                title="Refresh log"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              {studentLogs.length > 0 && (
                <button
                  onClick={handleClearStudentLogs}
                  className="p-2 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600"
                  title="Clear log history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Search Filter */}
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search student login alerts by student name, ID, email, country, city, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-white"
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            {filteredStudentLogs.length === 0 ? (
              <div className="p-10 text-center space-y-3">
                <Globe className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700">No Student Login Alerts Recorded Yet</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Student login alerts will automatically appear here whenever a student logs in. You can also click <strong>"Send Test Alert to panju4@gmail.com"</strong> above to test right now.
                </p>
                <button
                  onClick={handleTriggerTestNotification}
                  disabled={isSendingTest}
                  className="px-4 py-2 bg-[#002366] text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Immediate Test Alert</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3">Login Time</th>
                      <th className="p-3">Student Details</th>
                      <th className="p-3">Course / Program</th>
                      <th className="p-3">Place & Country</th>
                      <th className="p-3">IP & Network</th>
                      <th className="p-3">Email Notification</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudentLogs.map(rec => (
                      <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-mono text-[11px] text-slate-600 whitespace-nowrap align-top">
                          <div className="flex items-center gap-1 text-slate-800 font-semibold">
                            <Clock className="w-3 h-3 text-[#C5A059]" />
                            <span>{rec.timestamp}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {rec.timezone}
                          </span>
                        </td>
                        <td className="p-3 align-top">
                          <div className="font-bold text-[#002366] text-xs flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-400" />
                            <span>{rec.studentName}</span>
                          </div>
                          <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                            ID: <span className="font-bold text-slate-700">{rec.studentId}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {rec.studentEmail}
                          </div>
                        </td>
                        <td className="p-3 align-top max-w-xs">
                          <div className="font-semibold text-slate-800 text-xs">
                            {rec.program}
                          </div>
                          <div className="text-[10.5px] text-slate-500 mt-0.5 line-clamp-2">
                            {rec.courses.join(', ')}
                          </div>
                        </td>
                        <td className="p-3 align-top">
                          <div className="flex items-center gap-1 font-bold text-emerald-800 text-xs">
                            <MapPin className="w-3 h-3 text-emerald-600" />
                            <span>{rec.country}</span>
                          </div>
                          <div className="text-[11px] text-slate-600 mt-0.5">
                            {rec.city}, {rec.region}
                          </div>
                        </td>
                        <td className="p-3 align-top font-mono text-[11px] text-slate-600">
                          <div className="text-slate-800 font-bold">{rec.ipAddress}</div>
                          <span className="text-[9.5px] text-slate-400 truncate max-w-[120px] block" title={rec.userAgent}>
                            Browser Session
                          </span>
                        </td>
                        <td className="p-3 align-top">
                          <div className="flex items-center gap-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{rec.deliveryStatus.toUpperCase()}</span>
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1 font-mono">
                            To: <span className="font-bold">{rec.recipientEmail}</span>
                          </div>
                        </td>
                        <td className="p-3 align-top text-right whitespace-nowrap">
                          <button
                            onClick={() => handleCopySummary(rec)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
                            title="Copy alert notification details"
                          >
                            {copiedId === rec.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* GENERAL SYSTEM AUDIT LOGS TAB */}
      {activeTab === 'system' && (
        <div className="space-y-4">
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
      )}
    </div>
  );
};

