import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Calendar,
  CheckCircle2,
  Users,
  FileText,
  Clock,
  Trash2,
  AlertCircle,
  ExternalLink,
  Search,
  Check
} from 'lucide-react';
import { FacultyReadingAssignment, LibraryResource } from '../../types';
import { INITIAL_FACULTY_READING_ASSIGNMENTS } from '../../data/theologicalLibraryData';

interface Props {
  resources: LibraryResource[];
}

export const FacultyAssignmentManager: React.FC<Props> = ({ resources }) => {
  const [assignments, setAssignments] = useState<FacultyReadingAssignment[]>(
    INITIAL_FACULTY_READING_ASSIGNMENTS
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [selectedCourseCode, setSelectedCourseCode] = useState('HER-301');
  const [selectedCourseTitle, setSelectedCourseTitle] = useState('Biblical Hermeneutics & Exegesis');
  const [selectedResourceId, setSelectedResourceId] = useState(resources[0]?.id || '');
  const [requiredPages, setRequiredPages] = useState('Pages 1–45');
  const [dueDate, setDueDate] = useState('2026-11-15');
  const [instructions, setInstructions] = useState('');
  const [isRequired, setIsRequired] = useState(true);

  const filteredAssignments = assignments.filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.courseCode.toLowerCase().includes(q) ||
      a.courseTitle.toLowerCase().includes(q) ||
      a.resourceTitle.toLowerCase().includes(q) ||
      a.instructorName.toLowerCase().includes(q)
    );
  });

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const res = resources.find((r) => r.id === selectedResourceId) || resources[0];

    const newAssignment: FacultyReadingAssignment = {
      id: `asg-${Date.now()}`,
      courseId: `crs-${selectedCourseCode.toLowerCase()}`,
      courseCode: selectedCourseCode,
      courseTitle: selectedCourseTitle,
      instructorName: 'Faculty Instructor',
      resourceId: res.id,
      resourceTitle: res.title,
      resourceAuthor: res.author,
      requiredPages,
      dueDate,
      instructions,
      isRequired,
      totalEnrolledStudents: 30,
      completedStudentsCount: 0
    };

    setAssignments([newAssignment, ...assignments]);
    setShowCreateModal(false);
    setInstructions('');
  };

  const handleDelete = (id: string) => {
    setAssignments(assignments.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-[#002366] text-[#C5A059] font-mono font-bold text-xs">
              Faculty Reading Integration Desk
            </span>
            <span className="text-xs text-slate-500 font-mono">Course Syllabi & Library Linkage</span>
          </div>
          <h2 className="text-xl font-bold font-serif text-[#002366] mt-1">
            Course Reading Assignments & Student Completion Tracking
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Link curated theological treatises and exegetical commentaries directly into student LMS course workflows.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#002366] text-[#C5A059] hover:bg-[#001A4D] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Assign Reading to Course</span>
        </button>
      </div>

      {/* Active Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssignments.map((asg) => {
          const completionPct = Math.round(
            (asg.completedStudentsCount / asg.totalEnrolledStudents) * 100
          );
          return (
            <div
              key={asg.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded bg-[#002366] text-[#C5A059] font-mono font-bold text-xs">
                    {asg.courseCode}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      asg.isRequired
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {asg.isRequired ? 'Required Reading' : 'Recommended'}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider">
                    {asg.courseTitle}
                  </h4>
                  <h3 className="font-serif font-bold text-sm text-[#002366] line-clamp-2 mt-0.5">
                    {asg.resourceTitle}
                  </h3>
                  <div className="text-xs text-slate-500">
                    By {asg.resourceAuthor} • <strong className="text-[#002366]">{asg.requiredPages}</strong>
                  </div>
                </div>

                {asg.instructions && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 line-clamp-3">
                    {asg.instructions}
                  </p>
                )}
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Due: {asg.dueDate}</span>
                  </span>
                  <span className="font-bold text-[#002366] flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>
                      {asg.completedStudentsCount}/{asg.totalEnrolledStudents} Completed ({completionPct}%)
                    </span>
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#002366] h-full rounded-full transition-all"
                    style={{ width: `${completionPct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[11px] text-slate-400">Instructor: {asg.instructorName}</span>
                  <button
                    onClick={() => handleDelete(asg.id)}
                    className="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50 transition-colors"
                    title="Remove assignment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Reading Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-3 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold font-serif text-[#002366]">
                Assign Theological Reading to Course
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Course</label>
                <select
                  value={selectedCourseCode}
                  onChange={(e) => {
                    setSelectedCourseCode(e.target.value);
                    if (e.target.value === 'HER-301') setSelectedCourseTitle('Biblical Hermeneutics & Exegetical Method');
                    if (e.target.value === 'THE-201') setSelectedCourseTitle('Systematic Theology I: Doctrine of God');
                    if (e.target.value === 'PAS-401') setSelectedCourseTitle('Pastoral Ministry & Expository Homiletics');
                    if (e.target.value === 'MIS-302') setSelectedCourseTitle('Global Missiology & World Religions');
                    if (e.target.value === 'COU-305') setSelectedCourseTitle('Christian Counseling & Acute Trauma Care');
                  }}
                  className="w-full p-2 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none"
                >
                  <option value="HER-301">HER-301: Biblical Hermeneutics & Exegesis</option>
                  <option value="THE-201">THE-201: Systematic Theology I: Doctrine of God</option>
                  <option value="PAS-401">PAS-401: Pastoral Ministry & Expository Homiletics</option>
                  <option value="MIS-302">MIS-302: Global Missiology & World Religions</option>
                  <option value="COU-305">COU-305: Christian Counseling & Trauma Care</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Library Treatise / Resource</label>
                <select
                  value={selectedResourceId}
                  onChange={(e) => setSelectedResourceId(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none"
                >
                  {resources.map((r) => (
                    <option key={r.id} value={r.id}>
                      [{r.category}] {r.title} ({r.author})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Required Pages / Sections</label>
                  <input
                    type="text"
                    value={requiredPages}
                    onChange={(e) => setRequiredPages(e.target.value)}
                    placeholder="e.g. Pages 1–65 or Chapter 3"
                    className="w-full p-2 rounded-xl border border-slate-300 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Exegesis Instructions & Study Questions</label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Outline key terms to examine, Greek/Hebrew syntax to note, and expected reflection length..."
                  rows={3}
                  className="w-full p-2 rounded-xl border border-slate-300 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="reqCheck"
                  checked={isRequired}
                  onChange={(e) => setIsRequired(e.target.checked)}
                  className="w-4 h-4 rounded text-[#002366]"
                />
                <label htmlFor="reqCheck" className="text-slate-700 font-medium cursor-pointer">
                  Mark as Mandatory Core Reading (tracked on transcript/syllabus)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#002366] text-[#C5A059] hover:bg-[#001A4D] font-bold shadow-xs"
                >
                  Confirm & Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
