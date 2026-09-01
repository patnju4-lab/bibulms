import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { BookOpen, Plus, Edit2, Trash2, CheckCircle2, X, Sparkles, DollarSign, Clock, Award } from 'lucide-react';
import { Program, AcademicLevel } from '../../../types';

export const ProgramsManagementTab: React.FC = () => {
  const { programs, schools, addProgram, updateProgram, deleteProgram } = useApp();
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('all');
  const [notification, setNotification] = useState<string | null>(null);

  // Form State
  const [schoolId, setSchoolId] = useState(schools[0]?.id || 'sch-biblical');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [level, setLevel] = useState<AcademicLevel>('Bachelor');
  const [durationMonths, setDurationMonths] = useState(36);
  const [totalCredits, setTotalCredits] = useState(120);
  const [description, setDescription] = useState('');
  const [tuitionFeeUSD, setTuitionFeeUSD] = useState(1800);
  const [learningOutcomesStr, setLearningOutcomesStr] = useState('');
  const [careerPathsStr, setCareerPathsStr] = useState('');
  const [featured, setFeatured] = useState(false);

  const startCreate = () => {
    setEditingProgram(null);
    setSchoolId(schools[0]?.id || 'sch-biblical');
    setName('');
    setCode('');
    setLevel('Bachelor');
    setDurationMonths(36);
    setTotalCredits(120);
    setDescription('');
    setTuitionFeeUSD(1800);
    setLearningOutcomesStr('Demonstrate sound hermeneutical exegesis, Apply systematic theological principles in ministry');
    setCareerPathsStr('Senior Pastor, Theological Educator, Church Planter');
    setFeatured(false);
    setIsCreating(true);
  };

  const startEdit = (p: Program) => {
    setIsCreating(false);
    setEditingProgram(p);
    setSchoolId(p.schoolId);
    setName(p.name);
    setCode(p.code);
    setLevel(p.level);
    setDurationMonths(p.durationMonths);
    setTotalCredits(p.totalCredits);
    setDescription(p.description);
    setTuitionFeeUSD(p.tuitionFeeUSD);
    setLearningOutcomesStr(p.learningOutcomes?.join(', ') || '');
    setCareerPathsStr(p.careerPaths?.join(', ') || '');
    setFeatured(Boolean(p.featured));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const outcomes = learningOutcomesStr.split(',').map((s) => s.trim()).filter(Boolean);
    const careers = careerPathsStr.split(',').map((s) => s.trim()).filter(Boolean);

    if (isCreating) {
      addProgram({
        schoolId,
        name,
        code,
        level,
        durationMonths,
        totalCredits,
        description,
        learningOutcomes: outcomes,
        careerPaths: careers,
        tuitionFeeUSD,
        featured
      });
      setNotification(`Program "${name}" successfully registered into the University Catalog!`);
      setIsCreating(false);
    } else if (editingProgram) {
      updateProgram(editingProgram.id, {
        schoolId,
        name,
        code,
        level,
        durationMonths,
        totalCredits,
        description,
        learningOutcomes: outcomes,
        careerPaths: careers,
        tuitionFeeUSD,
        featured
      });
      setNotification(`Program "${name}" updated successfully!`);
      setEditingProgram(null);
    }
    setTimeout(() => setNotification(null), 3500);
  };

  const handleDelete = (id: string, programName: string) => {
    if (window.confirm(`Are you sure you want to delete "${programName}" from the catalog?`)) {
      deleteProgram(id);
      setNotification(`Program "${programName}" removed.`);
      setTimeout(() => setNotification(null), 3500);
    }
  };

  const filteredPrograms = selectedLevelFilter === 'all'
    ? programs
    : programs.filter((p) => p.level.toLowerCase() === selectedLevelFilter.toLowerCase());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-[#002366] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#C5A059]" />
            <span>Degree & Certificate Programs ({programs.length})</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage academic degree tracks, curriculum outcomes, credit requirements, and tuition pricing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Level Filter */}
          <select
            value={selectedLevelFilter}
            onChange={(e) => setSelectedLevelFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium bg-white"
          >
            <option value="all">All Academic Levels</option>
            <option value="Certificate">Certificate</option>
            <option value="Diploma">Diploma</option>
            <option value="Bachelor">Bachelor</option>
            <option value="Master">Master</option>
            <option value="Doctorate">Doctorate</option>
          </select>

          <button
            onClick={startCreate}
            className="px-4 py-2 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-bold uppercase tracking-wider border-2 border-[#C5A059] shadow flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-[#C5A059]" />
            <span>Add Program</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Create / Edit Form */}
      {(isCreating || editingProgram) && (
        <div className="bg-white rounded-xl border-2 border-[#002366] p-6 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-[#002366] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#C5A059]" />
              <span>{isCreating ? 'Add Degree / Certificate Program' : `Edit Program: ${editingProgram?.name}`}</span>
            </h3>
            <button
              onClick={() => { setIsCreating(false); setEditingProgram(null); }}
              className="text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Program Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bachelor of Theology (B.Th)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#002366]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Program Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BTH-401"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#002366]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Academic School</label>
                <select
                  value={schoolId}
                  onChange={(e) => setSchoolId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Academic Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as AcademicLevel)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Certificate">Certificate</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Bachelor">Bachelor</option>
                  <option value="Master">Master</option>
                  <option value="Doctorate">Doctorate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Total Credit Hours</label>
                <input
                  type="number"
                  required
                  value={totalCredits}
                  onChange={(e) => setTotalCredits(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Months)</label>
                <input
                  type="number"
                  required
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Total Tuition Fee (USD)</label>
                <input
                  type="number"
                  required
                  value={tuitionFeeUSD}
                  onChange={(e) => setTuitionFeeUSD(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-[#002366] focus:ring-[#002366]"
                />
                <label htmlFor="featuredCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Featured on Homepage
                </label>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">Program Overview & Description</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Core Learning Outcomes (Comma-separated)
                </label>
                <input
                  type="text"
                  value={learningOutcomesStr}
                  onChange={(e) => setLearningOutcomesStr(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ministry Career Opportunities (Comma-separated)
                </label>
                <input
                  type="text"
                  value={careerPathsStr}
                  onChange={(e) => setCareerPathsStr(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => { setIsCreating(false); setEditingProgram(null); }}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#002366] text-white text-xs font-bold uppercase tracking-wider border border-[#C5A059]"
              >
                {isCreating ? 'Create Program' : 'Update Program'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Programs Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#002366] text-white font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Program Name & Code</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3">School</th>
                <th className="px-4 py-3">Credits & Duration</th>
                <th className="px-4 py-3">Tuition Fee</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPrograms.map((p) => {
                const school = schools.find((s) => s.id === p.schoolId);
                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-[#002366]">{p.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{p.code}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#C5A059]/20 text-[#002366]">
                        {p.level}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 truncate max-w-[180px]">
                      {school?.name || 'Biblical Studies'}
                    </td>
                    <td className="px-4 py-3.5 font-medium">
                      <div>{p.totalCredits} Credit Hours</div>
                      <div className="text-[10px] text-slate-400">{p.durationMonths} Months</div>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-emerald-700 font-mono">
                      ${p.tuitionFeeUSD.toLocaleString()} USD
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => startEdit(p)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#002366] hover:bg-slate-100"
                          title="Edit Program"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete Program"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
