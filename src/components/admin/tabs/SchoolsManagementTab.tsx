import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Layers, Plus, Edit2, Trash2, CheckCircle2, X, Building, BookOpen } from 'lucide-react';
import { School } from '../../../types';

export const SchoolsManagementTab: React.FC = () => {
  const { schools, addSchool, updateSchool, deleteSchool } = useApp();
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [deanName, setDeanName] = useState('');
  const [deanTitle, setDeanTitle] = useState('');
  const [description, setDescription] = useState('');
  const [departmentsStr, setDepartmentsStr] = useState('');
  const [programsCount, setProgramsCount] = useState(4);

  const startCreate = () => {
    setEditingSchool(null);
    setName('');
    setCode('');
    setDeanName('');
    setDeanTitle('Dean & Professor of Theological Studies');
    setDescription('');
    setDepartmentsStr('Department of Systematic Theology, Department of Pastoral Ministry');
    setProgramsCount(4);
    setIsCreating(true);
  };

  const startEdit = (school: School) => {
    setIsCreating(false);
    setEditingSchool(school);
    setName(school.name);
    setCode(school.code);
    setDeanName(school.deanName);
    setDeanTitle(school.deanTitle);
    setDescription(school.description);
    setDepartmentsStr(school.departments.join(', '));
    setProgramsCount(school.programsCount);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const depts = departmentsStr.split(',').map((d) => d.trim()).filter(Boolean);

    if (isCreating) {
      addSchool({
        name,
        code,
        deanName,
        deanTitle,
        description,
        iconName: 'BookOpen',
        departments: depts,
        programsCount
      });
      setNotification(`School of "${name}" successfully established!`);
      setIsCreating(false);
    } else if (editingSchool) {
      updateSchool(editingSchool.id, {
        name,
        code,
        deanName,
        deanTitle,
        description,
        departments: depts,
        programsCount
      });
      setNotification(`School of "${name}" updated successfully!`);
      setEditingSchool(null);
    }
    setTimeout(() => setNotification(null), 3500);
  };

  const handleDelete = (id: string, schoolName: string) => {
    if (window.confirm(`Are you sure you want to delete "${schoolName}"? All associated department links will be updated.`)) {
      deleteSchool(id);
      setNotification(`Deleted school "${schoolName}".`);
      setTimeout(() => setNotification(null), 3500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-[#002366] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#C5A059]" />
            <span>Academic Schools & Faculties ({schools.length})</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Add, update, or remove academic faculties, appointed deans, and foundational departments.
          </p>
        </div>

        <button
          onClick={startCreate}
          className="px-4 py-2 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-bold uppercase tracking-wider border-2 border-[#C5A059] shadow flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-[#C5A059]" />
          <span>Add New School</span>
        </button>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Modal / Form Drawer for Create/Edit */}
      {(isCreating || editingSchool) && (
        <div className="bg-white rounded-xl border-2 border-[#002366] p-6 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-[#002366] flex items-center gap-2">
              <Building className="w-4 h-4 text-[#C5A059]" />
              <span>{isCreating ? 'Create New Academic School' : `Edit School: ${editingSchool?.name}`}</span>
            </h3>
            <button
              onClick={() => { setIsCreating(false); setEditingSchool(null); }}
              className="text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">School Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. School of Biblical & Theological Studies"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#002366]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">School Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SCH-BTS"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#002366]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dean / Head of Faculty</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Thomas E. Wright, Ph.D."
                  value={deanName}
                  onChange={(e) => setDeanName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#002366]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dean Title</label>
                <input
                  type="text"
                  placeholder="e.g. Dean of Biblical Studies & Professor"
                  value={deanTitle}
                  onChange={(e) => setDeanTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#002366]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Description / Academic Charter</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#002366]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Departments (Comma-separated)
                </label>
                <input
                  type="text"
                  value={departmentsStr}
                  onChange={(e) => setDepartmentsStr(e.target.value)}
                  placeholder="Department of Systematic Theology, Department of Biblical Exegesis"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#002366]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => { setIsCreating(false); setEditingSchool(null); }}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#002366] text-white text-xs font-bold uppercase tracking-wider border border-[#C5A059]"
              >
                {isCreating ? 'Create School' : 'Update School'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Schools Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schools.map((school) => (
          <div
            key={school.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between hover:border-[#002366] transition-all"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-[#002366]/10 text-[#002366] text-[10px] font-mono font-bold">
                  {school.code}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEdit(school)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-[#002366] hover:bg-slate-100"
                    title="Edit School"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(school.id, school.name)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                    title="Delete School"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-sm font-bold text-[#002366] leading-snug">{school.name}</h3>
              <p className="text-xs text-slate-600 line-clamp-2">{school.description}</p>

              <div className="p-2.5 bg-slate-50 rounded-lg text-xs space-y-1">
                <div className="font-bold text-slate-800">{school.deanName}</div>
                <div className="text-[10px] text-slate-500">{school.deanTitle}</div>
              </div>

              {school.departments && school.departments.length > 0 && (
                <div className="pt-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Departments:</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {school.departments.map((d, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>{school.programsCount || 4} Degree Tracks</span>
              <button
                onClick={() => startEdit(school)}
                className="text-[11px] font-bold text-[#C5A059] hover:underline"
              >
                Edit Faculty Details &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
