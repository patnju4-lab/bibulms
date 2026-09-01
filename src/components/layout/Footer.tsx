import React from 'react';
import { useApp, CurrentView } from '../../context/AppContext';
import { UniversityLogo } from '../common/UniversityLogo';
import { GraduationCap, MapPin, Phone, Mail, Globe, ShieldCheck, BookOpen, Award, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, universityInfo, schools } = useApp();

  const navigate = (view: CurrentView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#001A4D] text-slate-200 pt-14 pb-0 border-t-4 border-[#C5A059]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-white/10">
          {/* Column 1: Brand & Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <UniversityLogo size="md" withRing />
              <div>
                <div className="text-xs uppercase tracking-widest font-extrabold text-white font-sans">
                  Breakthrough International
                </div>
                <div className="text-sm font-bold text-[#C5A059] uppercase tracking-wider">
                  Bible University • Phoenix, AZ
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Dedicated to theological rigor, biblical inerrancy, spiritual fire, and global ministry empowerment. Equipping pastors, evangelists, counselors, and Christian leaders across 64 nations.
            </p>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>{universityInfo.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>{universityInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>{universityInfo.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>Global Online & Hybrid Theological Campus</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#001438] border border-white/10 text-[10px] font-bold uppercase tracking-wider text-[#C5A059]">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>Accredited Christian Theological University</span>
              </div>
            </div>
          </div>

          {/* Column 2: Academic Schools */}
          <div className="space-y-3">
            <div className="text-[11px] font-black uppercase tracking-widest text-[#C5A059]">
              Academic Schools
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300 font-medium">
              {schools.slice(0, 7).map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => navigate('schools')}
                    className="hover:text-[#C5A059] text-left transition-colors truncate max-w-[200px]"
                  >
                    {s.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => navigate('schools')}
                  className="text-[#C5A059] hover:underline font-bold uppercase text-[10px] tracking-wider"
                >
                  View All 9 Schools →
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Admissions & Learning */}
          <div className="space-y-3">
            <div className="text-[11px] font-black uppercase tracking-widest text-[#C5A059]">
              Admissions & LMS
            </div>
            <ul className="space-y-2 text-xs text-slate-300 font-medium">
              <li>
                <button onClick={() => navigate('bulletins')} className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5 text-white font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>
                  <span>Official University Bulletins</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('admissions')} className="hover:text-[#C5A059] transition-colors">
                  Online Admission Application
                </button>
              </li>
              <li>
                <button onClick={() => navigate('rpl')} className="hover:text-[#C5A059] transition-colors">
                  Prior Ministry Learning (RPL)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('programs')} className="hover:text-[#C5A059] transition-colors">
                  Degree & Certificate Catalog
                </button>
              </li>
              <li>
                <button onClick={() => navigate('library')} className="hover:text-[#C5A059] transition-colors">
                  Digital Theological Library
                </button>
              </li>
              <li>
                <button onClick={() => navigate('verification')} className="hover:text-[#C5A059] transition-colors">
                  Certificate Verification Portal
                </button>
              </li>
              <li>
                <button onClick={() => navigate('contact')} className="hover:text-[#C5A059] transition-colors">
                  International Student Support
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Institutional Portals */}
          <div className="space-y-3">
            <div className="text-[11px] font-black uppercase tracking-widest text-[#C5A059]">
              University Portals
            </div>
            <ul className="space-y-2 text-xs text-slate-300 font-medium">
              <li>
                <button onClick={() => navigate('portals')} className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5 font-bold text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>
                  <span>Portal Access & Security Hub</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('student-dashboard')} className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  <span>Student LMS & Exams</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('faculty-portal')} className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Faculty & Examiners</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('admin-portal')} className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                  <span>Admin & Registrar Portal</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('alumni')} className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span>Global Alumni (14,500+)</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('fellowships')} className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                  <span>Ministry Fellowships</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom copyright banner */}
      <div className="bg-[#001438] py-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest gap-2">
          <div>
            © {new Date().getFullYear()} Breakthrough International Bible University • Phoenix, AZ
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#C5A059]">ICCAS Certified Christian Institution</span>
            <span>•</span>
            <span>Academic Integrity Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
