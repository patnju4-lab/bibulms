import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Archive,
  BookOpen,
  UserCheck,
  Users,
  Building,
  CheckCircle2,
  X,
  Search,
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { School } from '../../../types';
import { AdminStudentProfile, AdminLecturerProfile } from '../../../types/admin';

interface SchoolsManagerProps {
  schools: School[];
  students: AdminStudentProfile[];
  lecturers: AdminLecturerProfile[];
  onAddSchool: (school: Omit<School, 'id'>) => void;
  onUpdateSchool: (id: string, updates: Partial<School>) => void;
  onDeleteSchool: (id: string) => void;
  onLogAudit: (action: string, record: string, details?: string) => void;
}

export const SchoolsManager: React.FC<SchoolsManagerProps> = ({
  schools,
  students,
  lecturers,
  onAddSchool,
  onUpdateSchool,
  onDeleteSchool,
  onLogAudit
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<School | null>(schools[0] || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchoolId, setEditingSchoolId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'departments' | 'programs' | 'students' | 'lecturers'>('details');
  const [notification, setNotification] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formDeanName, setFormDeanName] = useState('');
  const [formDeanTitle, setFormDeanTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDepartments, setFormDepartments] = useState('');
  const [formProgramsCount, setFormProgramsCount] = useState(4);

  const filteredSchools = schools.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.deanName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startCreate = () => {
    setEditingSchoolId(null);
    setFormName('');
    setFormCode('');
    setFormDeanName('');
    setFormDeanTitle('Dean & Professor of Theological Studies');
    setFormDescription('');
    setFormDepartments('Department of Systematic Theology, Department of Pastoral Ministry');
    setFormProgramsCount(4);
    setIsModalOpen(true);
  };

  const startEdit = (s: School) => {
    setEditingSchoolId(s.id);
    setFormName(s.name);
    setFormCode(s.code);
    setFormDeanName(s.deanName);
    setFormDeanTitle(s.deanTitle);
    setFormDescription(s.description);
    setFormDepartments(s.departments.join(', '));
    setFormProgramsCount(s.programsCount);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const depts = formDepartments.split(',').map(d => d.trim()).filter(Boolean);

    if (editingSchoolId) {
      onUpdateSchool(editingSchoolId, {
        name: formName,
        code: formCode,
        deanName: formDeanName,
        deanTitle: formDeanTitle,
        description: formDescription,
        departments: depts,
        programsCount: formProgramsCount
      });
      onLogAudit('Updated School Faculty', `${formName} (${formCode})`);
      setNotification(`School "${formName}" updated successfully.`);
      if (selectedSchool?.id === editingSchoolId) {
        setSelectedSchool(prev => prev ? {
          ...prev,
          name: formName,
          code: formCode,
          deanName: formDeanName,
          deanTitle: formDeanTitle,
          description: formDescription,
          departments: depts,
          programsCount: formProgramsCount
        } : null);
      }
    } else {
      onAddSchool({
        name: formName,
        code: formCode,
        deanName: formDeanName,
        deanTitle: formDeanTitle,
        description: formDescription,
        departments: depts,
        programsCount: formProgramsCount,
        iconName: 'BookOpen'
      });
      onLogAudit('Established New School Faculty', `${formName} (${formCode})`);
      setNotification(`School of "${formName}" established!`);
    }

    setIsModalOpen(false);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleArchive = (school: School) => {
    if (window.confirm(`Archive "${school.name}"? This faculty will be marked as inactive.`)) {
      onLogAudit('Archived School Faculty', `${school.name} (${school.code})`);
      setNotification(`School "${school.name}" archived.`);
      setTimeout(() => setNotification(null), 3500);
    }
  };

  const schoolStudents = selectedSchool
    ? students.filter(s => s.school.toLowerCase().includes(selectedSchool.name.toLowerCase()) || selectedSchool.name.toLowerCase().includes(s.school.toLowerCase()))
    : [];

  const schoolLecturers = selectedSchool
    ? lecturers.filter(l => l.school.toLowerCase().includes(selectedSchool.name.toLowerCase()) || selectedSchool.name.toLowerCase().includes(l.school.toLowerCase()))
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C5A059] uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Faculties & Academic Colleges Management</span>
          </div>
          <h2 className="text-xl font-display font-black text-[#002366]">
            Academic Schools & Faculties ({schools.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage academic colleges, appointed executive deans, foundational departments, and degree curricula.
          </p>
        </div>

        <button
          onClick={startCreate}
          className="px-4 py-2 rounded-xl bg-[#002366] hover:bg-[#001845] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-[#C5A059]" />
          <span>Establish New School</span>
        </button>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by school name, faculty code, or appointed dean..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-white"
        />
      </div>

      {/* Main Grid: Master List & Detailed Faculty Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Schools List (Left) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Faculties & Colleges ({filteredSchools.length}):
          </div>

          {filteredSchools.map((school) => {
            const isSelected = selectedSchool?.id === school.id;
            return (
              <div
                key={school.id}
                onClick={() => setSelectedSchool(school)}
                className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-blue-50/50 border-[#002366] shadow-sm ring-1 ring-[#002366]'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {school.code}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); startEdit(school); }}
                      className="p-1 text-slate-400 hover:text-[#002366]"
                      title="Edit School"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleArchive(school); }}
                      className="p-1 text-slate-400 hover:text-amber-600"
                      title="Archive School"
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-[#002366] mt-1.5 line-clamp-1">
                  {school.name}
                </h4>

                <div className="mt-2 text-[11px] text-slate-500">
                  <span className="text-slate-400">Dean:</span> <span className="font-medium text-slate-700">{school.deanName}</span>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>{school.departments.length} Depts</span>
                  <span>{school.programsCount} Degree Programs</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected School Details & Linked Entities (Right) */}
        <div className="lg:col-span-8">
          {selectedSchool ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#002366] text-[#C5A059]">
                      {selectedSchool.code}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Academic Senate Recognized</span>
                  </div>
                  <h3 className="text-lg font-display font-black text-[#002366] mt-1">
                    {selectedSchool.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(selectedSchool)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Faculty</span>
                  </button>
                </div>
              </div>

              {/* Sub-tabs for Section 5 */}
              <div className="flex border-b border-slate-200 gap-4 text-xs font-medium">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-2 transition-colors ${activeTab === 'details' ? 'border-b-2 border-[#C5A059] text-[#002366] font-bold' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Overview & Dean
                </button>
                <button
                  onClick={() => setActiveTab('departments')}
                  className={`pb-2 transition-colors ${activeTab === 'departments' ? 'border-b-2 border-[#C5A059] text-[#002366] font-bold' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Departments ({selectedSchool.departments.length})
                </button>
                <button
                  onClick={() => setActiveTab('students')}
                  className={`pb-2 transition-colors ${activeTab === 'students' ? 'border-b-2 border-[#C5A059] text-[#002366] font-bold' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Enrolled Students ({schoolStudents.length})
                </button>
                <button
                  onClick={() => setActiveTab('lecturers')}
                  className={`pb-2 transition-colors ${activeTab === 'lecturers' ? 'border-b-2 border-[#C5A059] text-[#002366] font-bold' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Appointed Lecturers ({schoolLecturers.length})
                </button>
              </div>

              {/* Tab 1: Overview */}
              {activeTab === 'details' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                      Dean of Faculty:
                    </span>
                    <h4 className="text-sm font-bold text-[#002366]">{selectedSchool.deanName}</h4>
                    <p className="text-slate-500 mt-0.5">{selectedSchool.deanTitle}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                      Faculty Charter & Academic Scope:
                    </h4>
                    <p className="p-3 bg-white border border-slate-200 rounded-xl text-slate-700 leading-relaxed">
                      {selectedSchool.description || 'Equipping students in rigorous theological exposition, pastoral character, and global gospel impact.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
                      <div className="text-xl font-bold text-[#002366]">{selectedSchool.programsCount}</div>
                      <div className="text-[10px] text-slate-500 font-medium mt-0.5">Accredited Programs</div>
                    </div>
                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                      <div className="text-xl font-bold text-amber-800">{selectedSchool.departments.length}</div>
                      <div className="text-[10px] text-slate-500 font-medium mt-0.5">Active Departments</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Departments */}
              {activeTab === 'departments' && (
                <div className="space-y-3 text-xs">
                  <span className="font-bold text-slate-500 block">
                    Departments under {selectedSchool.name}:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedSchool.departments.map((dept, i) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                        <span className="font-semibold text-slate-800">{dept}</span>
                        <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Active</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Enrolled Students */}
              {activeTab === 'students' && (
                <div className="space-y-3 text-xs">
                  {schoolStudents.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl">
                      No active student records in the SIS assigned directly to this faculty.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                      {schoolStudents.map(stu => (
                        <div key={stu.id} className="p-3 bg-white flex items-center justify-between">
                          <div>
                            <span className="font-bold text-[#002366] block">{stu.fullName}</span>
                            <span className="text-[10px] text-slate-500">{stu.admissionNumber} • {stu.program}</span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {stu.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Appointed Lecturers */}
              {activeTab === 'lecturers' && (
                <div className="space-y-3 text-xs">
                  {schoolLecturers.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl">
                      No faculty members currently recorded under this academic school.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                      {schoolLecturers.map(lec => (
                        <div key={lec.id} className="p-3 bg-white flex items-center justify-between">
                          <div>
                            <span className="font-bold text-[#002366] block">{lec.name}</span>
                            <span className="text-[10px] text-slate-500">{lec.department} • {lec.email}</span>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {lec.employmentStatus}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              Select a school from the list.
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit School Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#002366]">
                {editingSchoolId ? 'Edit Academic School' : 'Establish New Academic School'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">School / Faculty Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. School of Sacred Music & Worship"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Faculty Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SCH-WORSHIP"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Programs Count</label>
                  <input
                    type="number"
                    min={1}
                    value={formProgramsCount}
                    onChange={(e) => setFormProgramsCount(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Appointed Dean Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Arthur Pendelton, D.Mus."
                  value={formDeanName}
                  onChange={(e) => setFormDeanName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Dean Academic Title</label>
                <input
                  type="text"
                  value={formDeanTitle}
                  onChange={(e) => setFormDeanTitle(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Departments (Comma separated)</label>
                <input
                  type="text"
                  placeholder="Dept of Liturgical Music, Dept of Choral Leadership"
                  value={formDepartments}
                  onChange={(e) => setFormDepartments(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Charter Description</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
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
                  {editingSchoolId ? 'Save Changes' : 'Establish School'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
