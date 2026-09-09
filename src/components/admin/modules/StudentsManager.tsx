import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Eye,
  GraduationCap,
  FileText,
  BadgeCheck,
  CheckCircle2,
  X,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Building,
  DollarSign,
  Activity,
  Layers,
  ArrowRight,
  Filter,
  Download,
  Award
} from 'lucide-react';
import { AdminStudentProfile, StudentStatus } from '../../../types/admin';

interface StudentsManagerProps {
  students: AdminStudentProfile[];
  onAddStudent: (student: AdminStudentProfile) => void;
  onUpdateStudent: (id: string, updates: Partial<AdminStudentProfile>) => void;
  onLogAudit: (action: string, record: string, details?: string) => void;
}

export const StudentsManager: React.FC<StudentsManagerProps> = ({
  students,
  onAddStudent,
  onUpdateStudent,
  onLogAudit
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | StudentStatus>('All');
  const [selectedStudent, setSelectedStudent] = useState<AdminStudentProfile | null>(students[0] || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'finance' | 'exams' | 'transcript'>('overview');
  const [notification, setNotification] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [country, setCountry] = useState('Kenya');
  const [campus, setCampus] = useState('Nairobi National Regional Center');
  const [school, setSchool] = useState('School of Theology & Biblical Studies');
  const [department, setDepartment] = useState('Department of Systematic Theology');
  const [program, setProgram] = useState('Bachelor of Theology (B.Th.)');
  const [intake, setIntake] = useState('January 2026');
  const [studyMode, setStudyMode] = useState<'Online' | 'On-Campus' | 'Hybrid'>('Online');
  const [status, setStatus] = useState<StudentStatus>('Active');

  const filteredStudents = students.filter(s => {
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.campus.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newS: AdminStudentProfile = {
      id: `stu-${Date.now()}`,
      studentId: `BIBU-ID-${Date.now().toString().slice(-4)}`,
      admissionNumber: admissionNumber || `BIBU/ADM/2026/${(students.length + 1).toString().padStart(3, '0')}`,
      fullName,
      email,
      telephone,
      country,
      campus,
      school,
      department,
      program,
      intake,
      admissionDate: new Date().toISOString().slice(0, 10),
      studyMode,
      status,
      gpa: 3.50,
      feeBalance: 0,
      coursesEnrolled: 4,
      totalCreditsCompleted: 36
    };

    onAddStudent(newS);
    onLogAudit('Registered New Student into SIS', `${newS.admissionNumber} (${fullName})`);
    setNotification(`Student ${fullName} registered in SIS.`);
    setIsModalOpen(false);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleClearForGraduation = (student: AdminStudentProfile) => {
    onUpdateStudent(student.id, { status: 'Graduated' });
    onLogAudit('Cleared Student for Graduation', `${student.admissionNumber} (${student.fullName})`);
    setNotification(`${student.fullName} has been cleared for graduation and degree conferral.`);
    setSelectedStudent(prev => prev ? { ...prev, status: 'Graduated' } : null);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleIssueTranscript = (student: AdminStudentProfile) => {
    onLogAudit('Dispatched Official Transcript', `${student.admissionNumber} (${student.fullName})`);
    setNotification(`Official transcript for ${student.fullName} generated and dispatched.`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleIssueCertificate = (student: AdminStudentProfile) => {
    onLogAudit('Issued Official Degree Certificate', `${student.admissionNumber} (${student.fullName})`);
    setNotification(`Degree certificate issued for ${student.fullName}.`);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C5A059] uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Student Information System (SIS) Control</span>
          </div>
          <h2 className="text-xl font-display font-black text-[#002366]">
            Students Directory ({students.length} Records)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage student registrations, academic transcripts, degree progressions, examinations, fees, and graduation clearances.
          </p>
        </div>

        <button
          onClick={() => {
            setFullName('');
            setAdmissionNumber(`BIBU/ADM/2026/${(students.length + 1).toString().padStart(3, '0')}`);
            setEmail('');
            setTelephone('');
            setIsModalOpen(true);
          }}
          className="px-4 py-2 rounded-xl bg-[#002366] hover:bg-[#001845] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-[#C5A059]" />
          <span>Enroll New Student</span>
        </button>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by full name, admission #, email, program, or campus..."
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
          <option value="All">All Statuses ({students.length})</option>
          <option value="Active">Active</option>
          <option value="Deferred">Deferred</option>
          <option value="Suspended">Suspended</option>
          <option value="Graduated">Graduated</option>
        </select>
      </div>

      {/* Master Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Students Table / List (Left) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Enrolled Students ({filteredStudents.length}):
          </div>

          <div className="space-y-2 max-h-[750px] overflow-y-auto pr-1">
            {filteredStudents.map((stu) => {
              const isSelected = selectedStudent?.id === stu.id;
              return (
                <div
                  key={stu.id}
                  onClick={() => setSelectedStudent(stu)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-blue-50/60 border-[#002366] shadow-sm ring-1 ring-[#002366]'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      {stu.profilePhoto ? (
                        <img
                          src={stu.profilePhoto}
                          alt={stu.fullName}
                          className="w-8 h-8 rounded-full object-cover border border-[#C5A059]"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#002366] text-[#C5A059] flex items-center justify-center font-bold text-xs">
                          {stu.fullName.charAt(0)}
                        </div>
                      )}

                      <div className="min-w-0">
                        <span className="text-[10px] font-mono text-slate-400 block">
                          {stu.admissionNumber}
                        </span>
                        <h4 className="text-xs font-bold text-[#002366] truncate">
                          {stu.fullName}
                        </h4>
                      </div>
                    </div>

                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      stu.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                      stu.status === 'Graduated' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {stu.status}
                    </span>
                  </div>

                  <div className="mt-2 text-[11px] text-slate-600 truncate">
                    {stu.program}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>GPA: {stu.gpa?.toFixed(2) || 'N/A'}</span>
                    <span>{stu.campus.split(' ')[0]} Hub</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Student Dossier (Right) */}
        <div className="lg:col-span-7">
          {selectedStudent ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  {selectedStudent.profilePhoto ? (
                    <img
                      src={selectedStudent.profilePhoto}
                      alt={selectedStudent.fullName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#C5A059]"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#002366] text-[#C5A059] flex items-center justify-center font-bold text-lg">
                      {selectedStudent.fullName.charAt(0)}
                    </div>
                  )}

                  <div>
                    <span className="text-[10px] font-mono text-slate-400">
                      ID: {selectedStudent.studentId} • Adm: {selectedStudent.admissionNumber}
                    </span>
                    <h3 className="text-lg font-display font-black text-[#002366]">
                      {selectedStudent.fullName}
                    </h3>
                    <p className="text-xs text-slate-600">
                      {selectedStudent.program}
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#002366] text-[#C5A059]">
                  {selectedStudent.status}
                </span>
              </div>

              {/* Sub-tabs */}
              <div className="flex border-b border-slate-200 gap-4 text-xs font-medium">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-2 ${activeTab === 'overview' ? 'border-b-2 border-[#C5A059] text-[#002366] font-bold' : 'text-slate-500'}`}
                >
                  Student Profile
                </button>
                <button
                  onClick={() => setActiveTab('courses')}
                  className={`pb-2 ${activeTab === 'courses' ? 'border-b-2 border-[#C5A059] text-[#002366] font-bold' : 'text-slate-500'}`}
                >
                  Courses & GPA
                </button>
                <button
                  onClick={() => setActiveTab('finance')}
                  className={`pb-2 ${activeTab === 'finance' ? 'border-b-2 border-[#C5A059] text-[#002366] font-bold' : 'text-slate-500'}`}
                >
                  Tuition Balance
                </button>
                <button
                  onClick={() => setActiveTab('transcript')}
                  className={`pb-2 ${activeTab === 'transcript' ? 'border-b-2 border-[#C5A059] text-[#002366] font-bold' : 'text-slate-500'}`}
                >
                  Credentials & Actions
                </button>
              </div>

              {/* Tab 1: Profile */}
              {activeTab === 'overview' && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Campus / Center</span>
                      <span className="font-bold text-slate-800">{selectedStudent.campus}</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Country</span>
                      <span className="font-bold text-slate-800">{selectedStudent.country}</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Email</span>
                      <span className="font-mono text-slate-700">{selectedStudent.email}</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Telephone</span>
                      <span className="font-mono text-slate-700">{selectedStudent.telephone}</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">School Faculty</span>
                      <span className="font-bold text-slate-800">{selectedStudent.school}</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Department</span>
                      <span className="font-bold text-slate-800">{selectedStudent.department}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-blue-900 block">Intake & Admission:</span>
                      <span className="text-blue-700">{selectedStudent.intake} • Admitted on {selectedStudent.admissionDate}</span>
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-1 bg-white rounded border border-blue-200 text-blue-900">
                      Mode: {selectedStudent.studyMode}
                    </span>
                  </div>
                </div>
              )}

              {/* Tab 2: Courses */}
              {activeTab === 'courses' && (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-xl font-bold text-[#002366]">{selectedStudent.gpa?.toFixed(2) || '3.50'}</div>
                      <span className="text-[10px] text-slate-400 font-mono uppercase">Cumulative GPA</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-xl font-bold text-emerald-700">{selectedStudent.totalCreditsCompleted || 36}</div>
                      <span className="text-[10px] text-slate-400 font-mono uppercase">Credits Completed</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-xl font-bold text-indigo-700">{selectedStudent.coursesEnrolled || 4}</div>
                      <span className="text-[10px] text-slate-400 font-mono uppercase">Active Courses</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-700 block">Current Trimester Course Enrolment:</span>
                    <div className="space-y-1 text-[11px]">
                      <div className="p-2 bg-white rounded border border-slate-200 flex justify-between">
                        <span>THEO-301: Pneumatology & Spiritual Gifts</span>
                        <span className="font-bold text-emerald-700">In Progress (85%)</span>
                      </div>
                      <div className="p-2 bg-white rounded border border-slate-200 flex justify-between">
                        <span>HIST-204: Global Church Movements in Africa</span>
                        <span className="font-bold text-emerald-700">In Progress (72%)</span>
                      </div>
                      <div className="p-2 bg-white rounded border border-slate-200 flex justify-between">
                        <span>LEAD-402: Biblical Governance & Church Administration</span>
                        <span className="font-bold text-emerald-700">In Progress (64%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Finance */}
              {activeTab === 'finance' && (
                <div className="space-y-3 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 text-[10px] font-bold uppercase block">Outstanding Tuition Balance</span>
                      <div className="text-2xl font-bold text-slate-900 mt-0.5">
                        ${selectedStudent.feeBalance?.toLocaleString() || '0.00'}
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      (selectedStudent.feeBalance || 0) === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {(selectedStudent.feeBalance || 0) === 0 ? 'Fully Cleared' : 'Balance Due'}
                    </span>
                  </div>
                </div>
              )}

              {/* Tab 4: Transcript & Actions */}
              {activeTab === 'transcript' && (
                <div className="space-y-3 text-xs">
                  <span className="font-bold text-[#002366] block">
                    Registrar Academic Credential Actions:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={() => handleIssueTranscript(selectedStudent)}
                      className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center gap-2 text-left"
                    >
                      <FileText className="w-4 h-4 text-purple-600" />
                      <div>
                        <span className="font-bold text-slate-800 block">Issue Academic Transcript</span>
                        <span className="text-[10px] text-slate-500">Official seal & GPA verification</span>
                      </div>
                    </button>

                    <button
                      onClick={() => handleIssueCertificate(selectedStudent)}
                      className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center gap-2 text-left"
                    >
                      <BadgeCheck className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="font-bold text-slate-800 block">Issue Degree Certificate</span>
                        <span className="text-[10px] text-slate-500">Digital graduation certificate</span>
                      </div>
                    </button>

                    <button
                      onClick={() => handleClearForGraduation(selectedStudent)}
                      className="p-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 flex items-center gap-2 text-left"
                    >
                      <GraduationCap className="w-4 h-4 text-amber-700" />
                      <div>
                        <span className="font-bold text-amber-900 block">Clear for Graduation</span>
                        <span className="text-[10px] text-amber-700">Approve convocation candidate</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              Select a student record.
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#002366]">
                Enroll New Student in SIS
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Student Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Admission Number *</label>
                  <input
                    type="text"
                    required
                    value={admissionNumber}
                    onChange={(e) => setAdmissionNumber(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Telephone</label>
                  <input
                    type="text"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Campus Hub</label>
                  <input
                    type="text"
                    required
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Academic Degree Program *</label>
                <input
                  type="text"
                  required
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Intake</label>
                  <input
                    type="text"
                    value={intake}
                    onChange={(e) => setIntake(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Study Mode</label>
                  <select
                    value={studyMode}
                    onChange={(e) => setStudyMode(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Online">Online</option>
                    <option value="On-Campus">On-Campus</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#002366] text-[#C5A059] font-bold uppercase tracking-wider"
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
