import React, { useState } from 'react';
import {
  BookOpenCheck,
  Plus,
  Edit2,
  Search,
  CheckCircle2,
  X,
  Layers,
  GraduationCap,
  Clock,
  DollarSign,
  Sparkles,
  FileSpreadsheet,
  Award
} from 'lucide-react';
import { AdminProgram, ProgramType } from '../../../types/admin';
import { School } from '../../../types';

interface ProgramsManagerProps {
  programs: AdminProgram[];
  schools: School[];
  onAddProgram: (prog: AdminProgram) => void;
  onUpdateProgram: (id: string, updates: Partial<AdminProgram>) => void;
  onLogAudit: (action: string, record: string, details?: string) => void;
}

export const ProgramsManager: React.FC<ProgramsManagerProps> = ({
  programs,
  schools,
  onAddProgram,
  onUpdateProgram,
  onLogAudit
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | ProgramType>('All');
  const [selectedProgram, setSelectedProgram] = useState<AdminProgram | null>(programs[0] || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [type, setType] = useState<ProgramType>('Bachelor’s');
  const [award, setAward] = useState('');
  const [schoolName, setSchoolName] = useState(schools[0]?.name || 'School of Theology & Biblical Studies');
  const [department, setDepartment] = useState('Department of Systematic Theology');
  const [duration, setDuration] = useState('4 Years (120 Credit Hours)');
  const [entryRequirements, setEntryRequirements] = useState('High School Diploma / Secondary Cert / Ordination recommendation');
  const [studyMode, setStudyMode] = useState<('Online' | 'On-Campus' | 'Hybrid')[]>(['Online', 'Hybrid']);
  const [fees, setFees] = useState(2400);
  const [scholarshipAvailable, setScholarshipAvailable] = useState(true);
  const [curriculumUnits, setCurriculumUnits] = useState('THEO-101, THEO-102, BIBL-201, HIST-301');
  const [examinationRequirements, setExaminationRequirements] = useState('Comprehensive exams + Research Paper');
  const [status, setStatus] = useState<'Active' | 'Review' | 'Suspended'>('Active');

  const filteredPrograms = programs.filter(p => {
    const matchesType = typeFilter === 'All' || p.type === typeFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.award.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const startCreate = () => {
    setEditingId(null);
    setName('');
    setCode(`PROG-${Date.now().toString().slice(-4)}`);
    setType('Bachelor’s');
    setAward('Bachelor of Theology (B.Th.)');
    setSchoolName(schools[0]?.name || 'School of Theology & Biblical Studies');
    setDepartment('Department of Systematic Theology');
    setDuration('4 Years (120 Credit Hours)');
    setEntryRequirements('Secondary Certificate or pastoral recommendation');
    setStudyMode(['Online', 'Hybrid']);
    setFees(2400);
    setScholarshipAvailable(true);
    setCurriculumUnits('Core Theology, Hermeneutics, Church History, Homiletics');
    setExaminationRequirements('Written end-of-term examinations + Capstone');
    setStatus('Active');
    setIsModalOpen(true);
  };

  const startEdit = (p: AdminProgram) => {
    setEditingId(p.id);
    setName(p.name);
    setCode(p.code);
    setType(p.type);
    setAward(p.award);
    setSchoolName(p.schoolName);
    setDepartment(p.department);
    setDuration(p.duration);
    setEntryRequirements(p.entryRequirements);
    setStudyMode(p.studyMode);
    setFees(p.fees);
    setScholarshipAvailable(p.scholarshipAvailable);
    setCurriculumUnits(p.curriculumUnits.join(', '));
    setExaminationRequirements(p.examinationRequirements);
    setStatus(p.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const units = curriculumUnits.split(',').map(u => u.trim()).filter(Boolean);

    if (editingId) {
      onUpdateProgram(editingId, {
        name,
        code,
        type,
        award,
        schoolName,
        department,
        duration,
        entryRequirements,
        studyMode,
        fees,
        scholarshipAvailable,
        curriculumUnits: units,
        examinationRequirements,
        status
      });
      onLogAudit('Updated Program Curricula', `${name} (${code})`);
      setNotification(`Program "${name}" updated.`);
    } else {
      const newP: AdminProgram = {
        id: `prog-${Date.now()}`,
        name,
        code,
        type,
        award,
        schoolName,
        department,
        duration,
        entryRequirements,
        studyMode,
        fees,
        scholarshipAvailable,
        curriculumUnits: units,
        examinationRequirements,
        status
      };
      onAddProgram(newP);
      onLogAudit('Accredited New Academic Program', `${name} (${code})`);
      setNotification(`Program "${name}" accredited and active.`);
    }

    setIsModalOpen(false);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C5A059] uppercase tracking-wider mb-1">
            <BookOpenCheck className="w-4 h-4" />
            <span>Academic Curriculum & Degree Offerings</span>
          </div>
          <h2 className="text-xl font-display font-black text-[#002366]">
            Academic Programs & Degree Catalog ({programs.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Short courses, Certificates, Diplomas, Bachelor’s, Master’s, Doctorates, and Ministerial RPL tracks.
          </p>
        </div>

        <button
          onClick={startCreate}
          className="px-4 py-2 rounded-xl bg-[#002366] hover:bg-[#001845] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-[#C5A059]" />
          <span>Accredit New Program</span>
        </button>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search programs by name, code, school, or award degree..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-white"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as any)}
          className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-700 w-full sm:w-auto"
        >
          <option value="All">All Program Types</option>
          <option value="Short Course">Short Course</option>
          <option value="Certificate">Certificate</option>
          <option value="Diploma">Diploma</option>
          <option value="Bachelor’s">Bachelor’s</option>
          <option value="Master’s">Master’s</option>
          <option value="Doctorate">Doctorate</option>
          <option value="Ministerial / Ecclesiastical Credential">Ministerial Credential</option>
          <option value="Recognition of Prior Learning (RPL)">Recognition of Prior Learning (RPL)</option>
        </select>
      </div>

      {/* Program Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredPrograms.map((prog) => (
          <div
            key={prog.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#002366] text-[#C5A059]">
                  {prog.code}
                </span>

                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {prog.type}
                  </span>
                  <button
                    onClick={() => startEdit(prog)}
                    className="p-1 text-slate-400 hover:text-[#002366]"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-sm font-bold text-[#002366] leading-tight">
                {prog.name}
              </h3>

              <div className="mt-1 text-xs font-serif font-bold text-amber-900">
                Award: {prog.award}
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 text-[11px]">
                  <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{prog.schoolName}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{prog.duration}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px]">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-slate-800">${prog.fees.toLocaleString()} Total Tuition</span>
                  {prog.scholarshipAvailable && (
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 rounded border border-amber-200 ml-1">
                      Scholarships Available
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px]">
                <span className="text-slate-400 block mb-0.5 font-bold uppercase text-[9px]">Entry Requirements:</span>
                <span className="text-slate-700 line-clamp-2">{prog.entryRequirements}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <div className="flex items-center gap-1">
                {prog.studyMode.map(m => (
                  <span key={m} className="px-1.5 py-0.5 rounded bg-slate-100">{m}</span>
                ))}
              </div>
              <span className={`font-bold ${prog.status === 'Active' ? 'text-emerald-600' : 'text-amber-600'}`}>
                ● {prog.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#002366]">
                {editingId ? 'Edit Academic Program' : 'Accredit New Program'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Program Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Program Code *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Program Level / Type *</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Short Course">Short Course</option>
                    <option value="Certificate">Certificate</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Bachelor’s">Bachelor’s</option>
                    <option value="Master’s">Master’s</option>
                    <option value="Doctorate">Doctorate</option>
                    <option value="Ministerial / Ecclesiastical Credential">Ministerial Credential</option>
                    <option value="Recognition of Prior Learning (RPL)">Recognition of Prior Learning (RPL)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Award Conferred *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Master of Divinity (M.Div.)"
                    value={award}
                    onChange={(e) => setAward(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Academic School Faculty *</label>
                  <select
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {schools.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration *</label>
                  <input
                    type="text"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tuition Fees ($)</label>
                  <input
                    type="number"
                    value={fees}
                    onChange={(e) => setFees(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Review">Review</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Entry Requirements *</label>
                <textarea
                  rows={2}
                  required
                  value={entryRequirements}
                  onChange={(e) => setEntryRequirements(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Curriculum Units / Modules</label>
                <input
                  type="text"
                  value={curriculumUnits}
                  onChange={(e) => setCurriculumUnits(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Examination Requirements</label>
                <input
                  type="text"
                  value={examinationRequirements}
                  onChange={(e) => setExaminationRequirements(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <label className="flex items-center gap-2 font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={scholarshipAvailable}
                    onChange={(e) => setScholarshipAvailable(e.target.checked)}
                    className="rounded text-[#002366]"
                  />
                  <span>Bursary & Theological Scholarships Available</span>
                </label>
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
                  Save Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
