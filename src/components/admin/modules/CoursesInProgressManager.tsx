import React, { useState } from 'react';
import {
  Activity,
  Search,
  BookOpen,
  User,
  GraduationCap,
  Calendar,
  CheckCircle,
  Clock
} from 'lucide-react';
import { CourseInProgress } from '../../../types/admin';

interface CoursesInProgressManagerProps {
  courses: CourseInProgress[];
  onLogAudit: (action: string, record: string, details?: string) => void;
}

export const CoursesInProgressManager: React.FC<CoursesInProgressManagerProps> = ({
  courses,
  onLogAudit
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = courses.filter(c =>
    c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.lecturerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.program.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C5A059] uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" />
            <span>Academic Real-Time Progression Monitor</span>
          </div>
          <h2 className="text-xl font-display font-black text-[#002366]">
            Active Courses in Progress ({courses.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time syllabus completion velocity, assignment submissions, midterm exams, and projected grade letters.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search student, course code, course title, or appointed lecturer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-white"
        />
      </div>

      {/* Grid of Progression Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(c => (
          <div
            key={c.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#002366] text-[#C5A059]">
                  {c.courseCode}
                </span>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {c.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#002366] leading-tight">
                {c.courseName}
              </h3>

              <div className="mt-2 text-xs font-medium text-slate-800 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span className="font-bold">{c.studentName}</span>
              </div>

              <div className="text-[11px] text-slate-500 truncate mt-0.5">
                Program: {c.program}
              </div>

              <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Lecturer:</span>
                  <span className="font-semibold text-slate-700">{c.lecturerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Commenced:</span>
                  <span className="font-mono text-slate-600">{c.startDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Assignments / Exams:</span>
                  <span className="font-mono text-slate-700">{c.assignmentsCompleted} / {c.examsCompleted} Completed</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Projected Grade:</span>
                  <span className="text-emerald-700 font-mono text-sm">{c.currentGrade}</span>
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div className="mt-4 space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-500">Syllabus Completion</span>
                  <span className="font-bold text-[#002366]">{c.completionPercentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#002366] via-[#C5A059] to-emerald-500 transition-all duration-500 rounded-full"
                    style={{ width: `${c.completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
