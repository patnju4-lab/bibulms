import React, { useState } from 'react';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Layers,
  UserCheck,
  BookOpenCheck,
  Users,
  Search,
  CheckCircle2,
  X
} from 'lucide-react';
import { AdminDepartment, AdminStudentProfile, AdminLecturerProfile } from '../../../types/admin';
import { School } from '../../../types';

interface DepartmentsManagerProps {
  departments: AdminDepartment[];
  schools: School[];
  students: AdminStudentProfile[];
  lecturers: AdminLecturerProfile[];
  onAddDepartment: (dept: AdminDepartment) => void;
  onUpdateDepartment: (id: string, updates: Partial<AdminDepartment>) => void;
  onLogAudit: (action: string, record: string, details?: string) => void;
}

export const DepartmentsManager: React.FC<DepartmentsManagerProps> = ({
  departments,
  schools,
  students,
  lecturers,
  onAddDepartment,
  onUpdateDepartment,
  onLogAudit
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<AdminDepartment | null>(departments[0] || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Form
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [schoolId, setSchoolId] = useState(schools[0]?.id || '');
  const [headOfDepartment, setHeadOfDepartment] = useState('');
  const [email, setEmail] = useState('');
  const [programsStr, setProgramsStr] = useState('');

  const filteredDepts = departments.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.headOfDepartment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startCreate = () => {
    setEditingId(null);
    setName('');
    setCode(`DEPT-${Date.now().toString().slice(-3)}`);
    setSchoolId(schools[0]?.id || '');
    setHeadOfDepartment('');
    setEmail('department@bibu-edu.org');
    setProgramsStr('Certificate in Biblical Studies, Diploma in Ministry');
    setIsModalOpen(true);
  };

  const startEdit = (d: AdminDepartment) => {
    setEditingId(d.id);
    setName(d.name);
    setCode(d.code);
    setSchoolId(d.schoolId);
    setHeadOfDepartment(d.headOfDepartment);
    setEmail(d.email);
    setProgramsStr(d.programs.join(', '));
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedSchool = schools.find(s => s.id === schoolId) || schools[0];
    const pList = programsStr.split(',').map(p => p.trim()).filter(Boolean);

    if (editingId) {
      onUpdateDepartment(editingId, {
        name,
        code,
        schoolId,
        schoolName: matchedSchool.name,
        headOfDepartment,
        email,
        programs: pList
      });
      onLogAudit('Updated Academic Department', `${name} (${code})`);
      setNotification(`Department "${name}" updated.`);
    } else {
      const newD: AdminDepartment = {
        id: `dept-${Date.now()}`,
        name,
        code,
        schoolId,
        schoolName: matchedSchool.name,
        headOfDepartment,
        email,
        programs: pList,
        lecturerCount: 4,
        studentCount: 85,
        status: 'Active'
      };
      onAddDepartment(newD);
      onLogAudit('Added New Department', `${name} (${code}) under ${matchedSchool.name}`);
      setNotification(`Department "${name}" registered.`);
    }

    setIsModalOpen(false);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C5A059] uppercase tracking-wider mb-1">
            <FolderTree className="w-4 h-4" />
            <span>Academic Departments & Divisions</span>
          </div>
          <h2 className="text-xl font-display font-black text-[#002366]">
            Academic Departments Directory ({departments.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Departments anchored directly under accredited faculty schools, managed by appointed Heads of Department.
          </p>
        </div>

        <button
          onClick={startCreate}
          className="px-4 py-2 rounded-xl bg-[#002366] hover:bg-[#001845] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-[#C5A059]" />
          <span>Add Department</span>
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
          placeholder="Search by department name, code, school faculty, or HOD..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-white"
        />
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredDepts.map((dept) => (
          <div
            key={dept.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {dept.code}
                </span>

                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {dept.status}
                  </span>
                  <button
                    onClick={() => startEdit(dept)}
                    className="p-1 text-slate-400 hover:text-[#002366]"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-sm font-bold text-[#002366] leading-tight">
                {dept.name}
              </h3>

              <div className="mt-2 text-xs font-medium text-amber-800 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span className="truncate">{dept.schoolName}</span>
              </div>

              <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                <div>
                  <span className="text-slate-400">Head of Dept:</span>{' '}
                  <span className="font-bold text-slate-800">{dept.headOfDepartment}</span>
                </div>
                <div>
                  <span className="text-slate-400">Email:</span>{' '}
                  <span className="font-mono text-slate-600">{dept.email}</span>
                </div>
              </div>

              <div className="mt-3 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Degree Programs ({dept.programs.length}):
                </span>
                <div className="flex flex-wrap gap-1">
                  {dept.programs.map((p, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>{dept.lecturerCount} Lecturers</span>
              <span>{dept.studentCount} Students</span>
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
                {editingId ? 'Edit Department' : 'Establish New Department'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Code *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned School Faculty *</label>
                  <select
                    value={schoolId}
                    onChange={(e) => setSchoolId(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {schools.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Head of Department (HOD) *</label>
                  <input
                    type="text"
                    required
                    value={headOfDepartment}
                    onChange={(e) => setHeadOfDepartment(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Programs (Comma separated)</label>
                <input
                  type="text"
                  value={programsStr}
                  onChange={(e) => setProgramsStr(e.target.value)}
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
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
