import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, Layers, Award, ArrowRight, UserCheck, CheckCircle2 } from 'lucide-react';

export const SchoolsCatalog: React.FC = () => {
  const { schools, programs, selectedSchoolId, setSelectedSchoolId, setSelectedProgramId, setCurrentView } = useApp();
  const [activeTab, setActiveTab] = useState<string>(selectedSchoolId || schools[0]?.id || 'sch-biblical');

  const currentSchool = schools.find((s) => s.id === activeTab) || schools[0];
  const schoolPrograms = programs.filter((p) => p.schoolId === currentSchool.id);

  const handleProgramClick = (programId: string) => {
    setSelectedProgramId(programId);
    setCurrentView('programs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="text-xs font-black uppercase tracking-widest text-[#C5A059]">
          Academic Structure
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#002366]">
          The 9 Academic Schools of BIBU
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          BIBU operates 9 distinct theological faculties providing certified diplomas, undergraduate degrees, and postgraduate master and doctoral training.
        </p>
      </div>

      {/* School Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
        {schools.map((school) => {
          const isActive = school.id === activeTab;
          return (
            <button
              key={school.id}
              onClick={() => {
                setActiveTab(school.id);
                setSelectedSchoolId(school.id);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-[#002366] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-[#F8F9FB] border border-slate-200'
              }`}
            >
              <BookOpen className={`w-3.5 h-3.5 ${isActive ? 'text-[#C5A059]' : 'text-slate-400'}`} />
              <span>{school.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active School Profile Card */}
      {currentSchool && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#002366]/10 text-[#002366] font-mono">
                  {currentSchool.code}
                </span>
                <span className="text-xs text-slate-500 font-medium">Faculties & Departments</span>
              </div>
              <h2 className="text-2xl font-display font-bold text-[#002366]">
                {currentSchool.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                {currentSchool.description}
              </p>
            </div>

            <div className="shrink-0 p-4 bg-[#F8F9FB] rounded-xl border border-slate-200 text-left">
              <div className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]">Dean of Faculty</div>
              <div className="text-xs font-bold text-[#002366] font-display">{currentSchool.deanName}</div>
              <div className="text-[11px] text-slate-600">{currentSchool.deanTitle}</div>
            </div>
          </div>

          {/* Departments */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              Constituent Departments
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {currentSchool.departments.map((dept, i) => (
                <div key={i} className="p-3 rounded-lg bg-[#F8F9FB] border border-slate-200 text-xs font-semibold text-[#002366] flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                  <span>{dept}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Programs Offered */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
                Academic Programs & Degrees in this School ({schoolPrograms.length})
              </h3>
            </div>

            {schoolPrograms.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 bg-[#F8F9FB] rounded-xl border border-slate-200">
                Programs for this specialized school are enrolled by cohort inquiry. Contact the Dean for prospectus.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {schoolPrograms.map((prog) => (
                  <div
                    key={prog.id}
                    onClick={() => handleProgramClick(prog.id)}
                    className="p-5 rounded-xl border border-slate-200 hover:border-[#002366] bg-[#F8F9FB] hover:bg-white transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-[#C5A059]/20 text-[#002366]">
                          {prog.level}
                        </span>
                        <span className="text-xs font-bold text-[#002366] font-mono">
                          ${prog.tuitionFeeUSD} USD
                        </span>
                      </div>
                      <h4 className="text-sm font-bold font-display text-[#002366]">
                        {prog.name}
                      </h4>
                      <p className="text-[11px] text-slate-600 line-clamp-2">
                        {prog.description}
                      </p>
                      <div className="text-[10px] text-slate-500 flex items-center gap-3 pt-1 font-medium">
                        <span>⏳ {prog.durationMonths} Mos</span>
                        <span>📜 {prog.totalCredits} Credits</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#002366]">
                      <span>View Program Details</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
