import React, { useState } from 'react';
import {
  UserCog,
  Search,
  Plus,
  Edit2,
  Mail,
  Phone,
  Layers,
  BookOpen,
  MapPin,
  CheckCircle2,
  X,
  GraduationCap
} from 'lucide-react';
import { AdminLecturerProfile } from '../../../types/admin';
import { School } from '../../../types';

interface LecturersManagerProps {
  lecturers: AdminLecturerProfile[];
  schools: School[];
  onAddLecturer: (lec: AdminLecturerProfile) => void;
  onUpdateLecturer: (id: string, updates: Partial<AdminLecturerProfile>) => void;
  onLogAudit: (action: string, record: string, details?: string) => void;
}

export const LecturersManager: React.FC<LecturersManagerProps> = ({
  lecturers,
  schools,
  onAddLecturer,
  onUpdateLecturer,
  onLogAudit
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLec, setSelectedLec] = useState<AdminLecturerProfile | null>(lecturers[0] || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [qualifications, setQualifications] = useState('Ph.D. in Theological Studies, M.Div.');
  const [school, setSchool] = useState(schools[0]?.name || 'School of Theology & Biblical Studies');
  const [department, setDepartment] = useState('Department of Systematic Theology');
  const [campus, setCampus] = useState('Phoenix International Headquarters');
  const [employmentStatus, setEmploymentStatus] = useState<'Full-Time' | 'Adjunct' | 'Visiting Scholar'>('Full-Time');
  const [coursesStr, setCoursesStr] = useState('THEO-101, THEO-301');

  const filtered = lecturers.filter(l =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const cList = coursesStr.split(',').map(c => c.trim()).filter(Boolean);
    const newL: AdminLecturerProfile = {
      id: `lec-${Date.now()}`,
      lecturerId: `BIBU-FAC-${Date.now().toString().slice(-4)}`,
      name,
      email,
      phone,
      qualifications,
      school,
      department,
      campus,
      employmentStatus,
      assignedCourses: cList,
      activeStudents: 64,
      status: 'Active'
    };

    onAddLecturer(newL);
    onLogAudit('Appointed Academic Faculty Member', `${newL.lecturerId} (${name})`);
    setNotification(`Faculty appointment for ${name} registered.`);
    setIsModalOpen(false);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C5A059] uppercase tracking-wider mb-1">
            <UserCog className="w-4 h-4" />
            <span>Academic Faculty & Instruction Staff</span>
          </div>
          <h2 className="text-xl font-display font-black text-[#002366]">
            Lecturers & Faculty Directory ({lecturers.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Appointed theological professors, doctoral supervisors, adjunct lecturers, and course grading permissions.
          </p>
        </div>

        <button
          onClick={() => {
            setName('');
            setEmail('');
            setPhone('');
            setIsModalOpen(true);
          }}
          className="px-4 py-2 rounded-xl bg-[#002366] hover:bg-[#001845] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-[#C5A059]" />
          <span>Appoint Faculty Member</span>
        </button>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by faculty name, qualifications, school, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-white"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(lec => (
          <div
            key={lec.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {lec.lecturerId}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {lec.employmentStatus}
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#002366] leading-tight">
                {lec.name}
              </h3>

              <div className="mt-1 text-xs text-amber-900 font-serif">
                {lec.qualifications}
              </div>

              <div className="mt-3 space-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 text-[11px]">
                  <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{lec.school}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{lec.campus}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono text-slate-600 truncate">{lec.email}</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                  Assigned Teaching Units ({lec.assignedCourses.length}):
                </span>
                <div className="flex flex-wrap gap-1">
                  {lec.assignedCourses.map((c, idx) => (
                    <span key={idx} className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>{lec.activeStudents} Active Students</span>
              <span className="text-emerald-600 font-bold">● {lec.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#002366]">
                Appoint New Faculty Lecturer
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Lecturer Full Name & Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prof. David K. Mwaura, Ph.D."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Academic Credentials & Qualifications *</label>
                <input
                  type="text"
                  required
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">School Faculty</label>
                  <select
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {schools.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Employment Status</label>
                  <select
                    value={employmentStatus}
                    onChange={(e) => setEmploymentStatus(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Adjunct">Adjunct</option>
                    <option value="Visiting Scholar">Visiting Scholar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Courses (Comma separated)</label>
                <input
                  type="text"
                  value={coursesStr}
                  onChange={(e) => setCoursesStr(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
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
                  Appoint Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
