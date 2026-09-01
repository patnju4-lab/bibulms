import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, UserCheck, ChevronUp, ChevronDown, CheckCircle2, UserPlus, RotateCcw, LogIn } from 'lucide-react';
import { Role } from '../../types';

export const RoleSwitcher: React.FC = () => {
  const { currentUser, switchRole, allUsers, openAuthModal, resetToDefaultData } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const roles: { role: Role; label: string; name: string; subtitle: string; badge: string }[] = [
    {
      role: 'student',
      label: 'Student Portal',
      name: 'Pastor David Emmanuel',
      subtitle: 'B.Th Student • 78 Credits • Active',
      badge: 'bg-blue-600 text-white'
    },
    {
      role: 'faculty',
      label: 'Faculty & Dean Portal',
      name: 'Dr. Thomas E. Wright, Ph.D.',
      subtitle: 'Dean of Biblical Studies • Lecturer',
      badge: 'bg-emerald-700 text-white'
    },
    {
      role: 'admin',
      label: 'Super Admin & Chancellor',
      name: 'Dr. Michael C. Sterling, Th.D.',
      subtitle: 'President & Chancellor • Full Site CMS',
      badge: 'bg-purple-700 text-white'
    },
    {
      role: 'registrar',
      label: 'Office of the Registrar',
      name: 'Rev. Dr. Sarah M. Jenkins',
      subtitle: 'Academic Registrar & Admissions',
      badge: 'bg-amber-600 text-white'
    },
    {
      role: 'alumni',
      label: 'Alumni Network',
      name: 'Rev. Joshua K. Osei, D.Min',
      subtitle: 'Class of 2023 • Presiding Bishop',
      badge: 'bg-slate-700 text-white'
    },
    {
      role: 'guest',
      label: 'Public Visitor (Logged Out)',
      name: 'Guest Visitor',
      subtitle: 'Public Website • Requires Account for Portals',
      badge: 'bg-slate-500 text-white'
    }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-[#001A4D] text-white rounded-xl shadow-2xl border-2 border-[#C5A059] p-2.5 max-w-xs transition-all">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full gap-3 text-left focus:outline-none"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#C5A059] text-[#002366] flex items-center justify-center font-bold text-xs shadow-xs">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-[#C5A059] font-black flex items-center gap-1">
                <span>Active Persona</span>
              </div>
              <div className="text-xs font-bold text-slate-100 truncate max-w-[140px]">
                {currentUser.name}
              </div>
            </div>
          </div>
          <div className="text-[#C5A059]">
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </button>

        {isOpen && (
          <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5 max-h-80 overflow-y-auto pr-1">
            <div className="flex items-center justify-between px-2 pb-1">
              <span className="text-[9px] uppercase font-black tracking-widest text-[#C5A059]">
                Quick Persona Switcher:
              </span>
            </div>

            {roles.map((item) => {
              const isActive = currentUser.role === item.role;
              return (
                <button
                  key={item.role}
                  onClick={() => {
                    switchRole(item.role);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-start justify-between gap-2 ${
                    isActive
                      ? 'bg-[#002366] border border-[#C5A059] text-[#C5A059]'
                      : 'hover:bg-white/10 text-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-bold flex items-center gap-1.5 text-xs">
                      <span>{item.label}</span>
                      {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] inline" />}
                    </div>
                    <div className="text-[11px] text-slate-200 font-semibold">{item.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{item.subtitle}</div>
                  </div>
                </button>
              );
            })}

            {/* Create Account & Reset actions */}
            <div className="pt-2 border-t border-white/10 space-y-1.5">
              <button
                onClick={() => {
                  setIsOpen(false);
                  openAuthModal('register');
                }}
                className="w-full py-1.5 px-2.5 rounded-lg bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create New Account</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Reset all site data to default demo state?')) {
                    resetToDefaultData();
                    setIsOpen(false);
                  }
                }}
                className="w-full py-1.5 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-medium text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-3 h-3 text-slate-400" />
                <span>Restore Default Data</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
