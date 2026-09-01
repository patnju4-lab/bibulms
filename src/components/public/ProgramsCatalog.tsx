import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, Award, Sparkles, Filter, ArrowRight, CheckCircle2, Search } from 'lucide-react';
import { AcademicLevel } from '../../types';

export const ProgramsCatalog: React.FC = () => {
  const { programs, schools, selectedProgramId, setSelectedProgramId, setCurrentView } = useApp();
  const [levelFilter, setLevelFilter] = useState<string>('All');
  const [schoolFilter, setSchoolFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const levels: ('All' | AcademicLevel)[] = ['All', 'Certificate', 'Diploma', 'Bachelor', 'Master', 'Doctorate'];

  const filteredPrograms = programs.filter((p) => {
    const matchLevel = levelFilter === 'All' || p.level === levelFilter;
    const matchSchool = schoolFilter === 'All' || p.schoolId === schoolFilter;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchLevel && matchSchool && matchSearch;
  });

  const selectedProgram = programs.find((p) => p.id === selectedProgramId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="text-xs font-black uppercase tracking-widest text-[#C5A059]">
          Theological Degree Catalog
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#002366]">
          Academic Programs & Degrees
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Comprehensive curriculum from foundational certificates to terminal doctoral research degrees. Flexible payment plans and RPL credit transfers available.
        </p>
      </div>

      {/* Program Detail Modal / Banner if Selected */}
      {selectedProgram && (
        <div className="bg-[#002366] text-white rounded-xl p-6 sm:p-8 border-2 border-[#C5A059] shadow-xl space-y-6 animate-in fade-in">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded bg-[#C5A059] text-[#002366]">
                  {selectedProgram.level}
                </span>
                <span className="text-xs text-[#C5A059] font-mono">Code: {selectedProgram.code}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                {selectedProgram.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {selectedProgram.description}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#001A4D] border border-[#C5A059]/30 text-right shrink-0">
              <div className="text-xs text-slate-300">Total Program Tuition</div>
              <div className="text-2xl font-black text-[#C5A059] font-mono">${selectedProgram.tuitionFeeUSD} USD</div>
              <div className="text-[11px] text-slate-300 mt-1 font-medium">⏳ {selectedProgram.durationMonths} Months • 📜 {selectedProgram.totalCredits} Credits</div>
              <button
                onClick={() => {
                  setCurrentView('admissions');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mt-4 w-full px-4 py-2.5 rounded-lg bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] font-black uppercase tracking-wider text-xs shadow-md transition-all hover:scale-105"
              >
                Apply for this Program →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-widest text-[#C5A059] font-display">
                Expected Learning Outcomes
              </h4>
              <ul className="text-xs text-slate-200 space-y-1.5">
                {selectedProgram.learningOutcomes.map((out, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                    <span>{out}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-widest text-[#C5A059] font-display">
                Target Vocational & Ministry Callings
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedProgram.careerPaths.map((cp, i) => (
                  <span key={i} className="px-2.5 py-1 rounded bg-[#001A4D] border border-white/10 text-xs font-medium text-slate-200">
                    {cp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search programs (e.g., Theology, Ministry, Chaplaincy)..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
            />
          </div>

          {/* School Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">School:</span>
            <select
              value={schoolFilter}
              onChange={(e) => setSchoolFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#002366]"
            >
              <option value="All">All 9 Schools</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Level Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-500 font-medium">Level:</span>
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                levelFilter === lvl
                  ? 'bg-[#002366] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrograms.map((prog) => {
          const school = schools.find((s) => s.id === prog.schoolId);
          return (
            <div
              key={prog.id}
              onClick={() => {
                setSelectedProgramId(prog.id);
                window.scrollTo({ top: 150, behavior: 'smooth' });
              }}
              className="bg-white rounded-xl border border-slate-200 hover:border-[#002366] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-[#002366]/10 text-[#002366]">
                    {prog.level}
                  </span>
                  <span className="text-xs font-bold text-[#C5A059] font-mono">
                    ${prog.tuitionFeeUSD} USD
                  </span>
                </div>

                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  {school?.name || 'School of Theological Studies'}
                </div>

                <h3 className="text-base font-bold font-display text-[#002366] leading-snug">
                  {prog.name}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {prog.description}
                </p>

                <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1 font-medium">
                  <span>⏳ {prog.durationMonths} Mos</span>
                  <span>📜 {prog.totalCredits} Credits</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#002366]">
                <span className="text-slate-400 font-mono text-[10px]">Code: {prog.code}</span>
                <span className="flex items-center gap-1 text-[#002366] hover:text-[#C5A059]">
                  Select Program Details →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
