import React from 'react';
import { useApp } from '../../context/AppContext';
import { UniversityLogo } from '../common/UniversityLogo';
import {
  GraduationCap,
  Award,
  FileText,
  Printer,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Calendar,
  Building
} from 'lucide-react';

export const TranscriptView: React.FC = () => {
  const { currentUser, setCurrentView, universityInfo, grades } = useApp();

  // Group grades by semester for this student
  const studentGrades = grades.filter((g) => g.studentId === currentUser.id);

  // Group by semester preserving chronological order
  const semesterOrder = ['Spring 2026', 'Fall 2025', 'Spring 2025', 'Fall 2024'];
  const groupedSemesters = semesterOrder.map((term) => {
    const termCourses = studentGrades.filter((g) => g.semester === term);
    const termCredits = termCourses.reduce((sum, c) => sum + c.creditHours, 0);
    const termPoints = termCourses.reduce((sum, c) => sum + (c.creditHours * c.gradePoint), 0);
    const termGpa = termCredits > 0 ? termPoints / termCredits : 0;

    return {
      term,
      termGpa,
      courses: termCourses.map((c) => ({
        code: c.courseCode,
        title: c.courseTitle,
        credits: c.creditHours,
        grade: c.letterGrade,
        points: c.creditHours * c.gradePoint
      }))
    };
  }).filter((sem) => sem.courses.length > 0);

  const totalCourseCredits = studentGrades.reduce((acc, g) => acc + g.creditHours, 0);
  const totalQualityPoints = studentGrades.reduce((acc, g) => acc + (g.creditHours * g.gradePoint), 0);
  const calculatedGpa = totalCourseCredits > 0 ? totalQualityPoints / totalCourseCredits : (currentUser.gpa || 3.84);
  const totalCreditsConferred = currentUser.creditsEarned || totalCourseCredits;

  const transcript = {
    semesters: groupedSemesters,
    totalCreditsEarned: totalCreditsConferred,
    cumulativeGpa: calculatedGpa
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={() => setCurrentView('student-dashboard')}
          className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-[#002366] flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Student Dashboard</span>
        </button>

        <button
          onClick={handlePrint}
          className="px-5 py-2.5 rounded-lg bg-[#002366] hover:bg-[#001A4D] text-white font-bold uppercase tracking-wider text-xs shadow flex items-center gap-2"
        >
          <Printer className="w-4 h-4 text-[#C5A059]" />
          <span>Print Official Transcript</span>
        </button>
      </div>

      {/* Official Academic Transcript Document */}
      <div className="bg-white rounded-xl border-4 border-double border-slate-300 p-8 sm:p-12 shadow-xs space-y-8 text-slate-900 font-sans print:border-none print:shadow-none print:p-0">
        {/* Institutional Header */}
        <div className="text-center space-y-3 border-b-2 border-[#002366] pb-6">
          <div className="flex justify-center mb-1">
            <UniversityLogo size="xl" withRing className="shadow-md" />
          </div>
          <div className="text-xs font-black uppercase tracking-widest text-[#C5A059] font-display">
            Office of the University Registrar • Official Academic Record
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-[#002366] tracking-tight">
            BREAKTHROUGH INTERNATIONAL BIBLE UNIVERSITY
          </h1>
          <p className="text-xs text-slate-600 font-serif italic">
            Phoenix, Arizona, United States of America • Accredited Theological Institution
          </p>
        </div>

        {/* Student Biographical Data */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#F8F9FB] rounded-xl border border-slate-200 text-xs">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Student Name</div>
            <div className="font-bold text-slate-900 mt-0.5 font-display">{currentUser.name}</div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Student ID Number</div>
            <div className="font-mono font-bold text-[#002366] mt-0.5">{currentUser.studentId}</div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Degree Program</div>
            <div className="font-semibold text-slate-900 mt-0.5">{currentUser.programName}</div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Academic Standing</div>
            <div className="font-bold text-emerald-700 mt-0.5">Good Standing (Dean's List)</div>
          </div>
        </div>

        {/* Semesters & Courses Breakdown */}
        <div className="space-y-6">
          {transcript.semesters.map((sem, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-300 pb-1 text-xs font-bold text-[#002366] font-display">
                <span className="uppercase tracking-wider">{sem.term}</span>
                <span>Term GPA: {sem.termGpa.toFixed(2)}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F8F9FB] text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3">Course Code</th>
                      <th className="py-2.5 px-3">Course Title</th>
                      <th className="py-2.5 px-3 text-center">Credits</th>
                      <th className="py-2.5 px-3 text-center">Grade</th>
                      <th className="py-2.5 px-3 text-center">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sem.courses.map((c, cIdx) => (
                      <tr key={cIdx} className="hover:bg-[#F8F9FB]">
                        <td className="py-2 px-3 font-mono font-semibold text-slate-800">{c.code}</td>
                        <td className="py-2 px-3 font-medium text-slate-900">{c.title}</td>
                        <td className="py-2 px-3 text-center">{c.credits}</td>
                        <td className="py-2 px-3 text-center font-bold text-[#002366]">{c.grade}</td>
                        <td className="py-2 px-3 text-center font-mono">{c.points.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Academic Cumulative Summary */}
        <div className="p-5 bg-[#002366] text-white rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#002366]">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-wider text-[#C5A059] font-black font-display">
              Cumulative Academic Record
            </div>
            <div className="text-xs text-slate-300">
              Total Credits Attempted: <strong>{transcript.totalCreditsEarned}</strong> • Credits Earned: <strong>{transcript.totalCreditsEarned}</strong>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-300">Cumulative Grade Point Average</div>
            <div className="text-3xl font-black font-display text-[#C5A059]">
              {transcript.cumulativeGpa.toFixed(2)} / 4.00
            </div>
          </div>
        </div>

        {/* Registrar Seal & Verification Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t-2 border-[#002366] text-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <ShieldCheck className="w-5 h-5" />
              <span className="uppercase tracking-wider font-display">Official Electronic Transcript Security Verification</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              This document is certified by the Office of the Registrar, Breakthrough International Bible University, Phoenix, AZ. Any alteration renders this record void.
            </p>
          </div>

          <div className="space-y-4 text-right">
            <div>
              <div className="font-display italic text-base text-[#002366] font-bold">Dr. Elizabeth Vance, Ph.D.</div>
              <div className="text-[10px] uppercase font-bold text-slate-400">University Registrar</div>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              Issue Date: August 2026 • Document Ref: TRN-2026-BTH-7492
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
